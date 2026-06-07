"use client";

import { useState } from "react";
import type { RecipeResult } from "@/lib/types";

const CONFIDENCE_LABELS = {
  high: "高",
  medium: "中",
  low: "低",
} as const;

export function RecipeResultView({ result }: { result: RecipeResult }) {
  const [openStep, setOpenStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    const text = formatRecipeText(result);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!result.feasible) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-900">パーツが不足しています</p>
          <p className="mt-1 text-sm text-amber-800">
            現在のパーツでは指定条件の作品は作成できません。
          </p>
        </div>

        {result.suggested_additions && result.suggested_additions.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-stone-700">追加が必要な目安</h2>
            <ul className="space-y-2 text-sm text-stone-700">
              {result.suggested_additions.map((item, i) => (
                <li key={i} className="rounded-md bg-stone-50 px-3 py-2">
                  {item.color} {item.type}: あと {item.count} — {item.reason}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-stone-900">{result.title}</h2>
        <p className="mt-2 text-stone-600">{result.concept}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-500">
          <span className="rounded-full bg-stone-100 px-3 py-1">{result.difficulty}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">
            約 {result.estimated_time_minutes} 分
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1">
            信頼度: {CONFIDENCE_LABELS[result.confidence]}
          </span>
        </div>
      </section>

      {result.warnings && result.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {result.warnings.map((w, i) => (
            <p key={i}>⚠ {w}</p>
          ))}
        </div>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          必要パーツ
        </h3>
        <div className="overflow-x-auto rounded-lg border border-stone-200">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-left text-stone-600">
              <tr>
                <th className="px-4 py-2 font-medium">色</th>
                <th className="px-4 py-2 font-medium">形状</th>
                <th className="px-4 py-2 font-medium">数量</th>
                <th className="px-4 py-2 font-medium">用途</th>
              </tr>
            </thead>
            <tbody>
              {result.parts_estimate.map((part, i) => (
                <tr key={i} className="border-t border-stone-100">
                  <td className="px-4 py-2">{part.color}</td>
                  <td className="px-4 py-2">{part.type}</td>
                  <td className="px-4 py-2">{part.count}</td>
                  <td className="px-4 py-2 text-stone-500">{part.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          組み立て手順（3ステップ）
        </h3>
        <div className="space-y-2">
          {result.steps.map((step) => {
            const isOpen = openStep === step.step;
            return (
              <div
                key={step.step}
                className="rounded-lg border border-stone-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenStep(isOpen ? 0 : step.step)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="font-medium text-stone-900">
                    Step {step.step}: {step.title}
                  </span>
                  <span className="text-stone-400">{isOpen ? "▼" : "▶"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-stone-100 px-4 py-3 text-sm text-stone-700">
                    <p>{step.instruction}</p>
                    {step.tips && (
                      <p className="mt-2 rounded-md bg-stone-50 px-3 py-2 text-stone-600">
                        💡 {step.tips}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {result.structure_notes && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
            構造メモ
          </h3>
          <p className="rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-700">
            {result.structure_notes}
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={copyToClipboard}
        className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
      >
        {copied ? "コピーしました" : "テキストをコピー"}
      </button>
    </div>
  );
}

function formatRecipeText(result: RecipeResult): string {
  const lines = [
    result.title,
    result.concept,
    "",
    `難易度: ${result.difficulty} / 約 ${result.estimated_time_minutes} 分`,
    "",
    "【必要パーツ】",
    ...result.parts_estimate.map(
      (p) => `- ${p.color} ${p.type}: ${p.count}${p.note ? ` (${p.note})` : ""}`,
    ),
    "",
    "【組み立て手順】",
    ...result.steps.map(
      (s) =>
        `Step ${s.step}: ${s.title}\n${s.instruction}${s.tips ? `\n💡 ${s.tips}` : ""}`,
    ),
  ];

  if (result.structure_notes) {
    lines.push("", "【構造メモ】", result.structure_notes);
  }

  return lines.join("\n");
}
