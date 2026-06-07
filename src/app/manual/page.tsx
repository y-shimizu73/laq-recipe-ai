"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import {
  COLORS,
  DIFFICULTIES,
  GENRES,
  PART_TYPES,
  SIZES,
} from "@/lib/constants";
import type { Difficulty, ManualRecipeResponse, PartInput, Size } from "@/lib/types";

const STORAGE_KEY = "laq-recipe-result";

type PartRow = PartInput & { id: string };

function newPartRow(): PartRow {
  return {
    id: crypto.randomUUID(),
    color: "黒",
    type: "スクエア 5×5",
    count: 10,
  };
}

export default function ManualPage() {
  const router = useRouter();
  const [genre, setGenre] = useState<string>(GENRES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("中級");
  const [size, setSize] = useState<Size>("standard");
  const [notes, setNotes] = useState("");
  const [parts, setParts] = useState<PartRow[]>([newPartRow(), newPartRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updatePart(id: string, field: keyof PartInput, value: string | number) {
    setParts((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  function addPart() {
    setParts((rows) => [...rows, newPartRow()]);
  }

  function removePart(id: string) {
    setParts((rows) => (rows.length > 1 ? rows.filter((r) => r.id !== id) : rows));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/recipes/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre,
          difficulty,
          size,
          notes,
          parts: parts.map(({ color, type, count }) => ({ color, type, count })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message ?? "生成に失敗しました");
      }

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data as ManualRecipeResponse));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-stone-50">
      <Header title="条件を入力" backHref="/" />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <label className="mb-3 block text-sm font-semibold text-stone-700">
              ジャンル
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenre(g)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    genre === g
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="mb-3 block text-sm font-semibold text-stone-700">
              難易度
            </label>
            <div className="flex gap-4">
              {DIFFICULTIES.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="radio"
                    name="difficulty"
                    value={d}
                    checked={difficulty === d}
                    onChange={() => setDifficulty(d)}
                    className="accent-stone-900"
                  />
                  {d}
                </label>
              ))}
            </div>
          </section>

          <section>
            <label htmlFor="size" className="mb-2 block text-sm font-semibold text-stone-700">
              サイズ感
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value as Size)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
            >
              {SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-stone-700">保有パーツ</label>
              <button
                type="button"
                onClick={addPart}
                className="text-sm text-amber-700 hover:text-amber-900"
              >
                + 行を追加
              </button>
            </div>

            <div className="space-y-3">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="grid grid-cols-12 gap-2 rounded-lg border border-stone-200 bg-white p-3"
                >
                  <select
                    value={part.color}
                    onChange={(e) => updatePart(part.id, "color", e.target.value)}
                    className="col-span-3 rounded border border-stone-200 px-2 py-2 text-sm"
                  >
                    {COLORS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    value={part.type}
                    onChange={(e) => updatePart(part.id, "type", e.target.value)}
                    className="col-span-5 rounded border border-stone-200 px-2 py-2 text-sm"
                  >
                    {PART_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    value={part.count}
                    onChange={(e) =>
                      updatePart(part.id, "count", parseInt(e.target.value, 10) || 1)
                    }
                    className="col-span-3 rounded border border-stone-200 px-2 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removePart(part.id)}
                    className="col-span-1 text-stone-400 hover:text-stone-700"
                    aria-label="削除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-stone-700">
              メモ（任意）
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="例: 赤を多めに使いたい、デスクに置けるサイズ"
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
            />
          </section>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "作品案を生成中…" : "作品案を生成する"}
          </button>
        </form>
      </main>
    </div>
  );
}
