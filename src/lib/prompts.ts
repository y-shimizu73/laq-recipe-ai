import type { ManualRecipeRequest } from "./types";

export const SYSTEM_PROMPT = `あなたは LaQ（ラキュー）の作品提案アシスタントです。対象は大人のホビーユーザーです。

役割:
- ユーザーが保有するパーツと、指定ジャンル・難易度に基づき、オリジナル作品の制作案を提案する。
- 提案は「実際に組み立て可能」であることを最優先とする。入力にない色・形状・数量のパーツを要求してはならない。

出力ルール:
- 必ず指定の JSON スキーマに従う。JSON 以外の文字列は出力しない。
- 数量は整数または「N〜M」の範囲。範囲を使う場合は理由を parts_estimate[].note に書く。
- 手順は正確に 3 ステップ。各ステップは「何を作るか」「どう繋ぐか」が分かる粒度にする。
- パーツが明らかに不足している場合は feasible: false とし、不足内容を suggested_additions に書く。

禁止:
- 存在しない LaQ パーツ名の invent
- 入力を無視した大型・複雑な作品の提案
- 子ども向けの過度に簡略化した表現のみの手順`;

const DIFFICULTY_GUIDELINES: Record<string, string> = {
  初級: "パーツ消費は控えめ、対称構造、接続 2 層まで",
  中級: "非対称 OK、接続 3 層、一部懸空は固定で表現",
  上級: "複合シルエット、細部表現、バランス調整の tips 必須",
};

export function buildManualUserPrompt(params: ManualRecipeRequest): string {
  const partsLines = params.parts
    .map((p) => `- ${p.color} ${p.type}: ${p.count}`)
    .join("\n");

  return `【入力種別】manual
【ジャンル】${params.genre}
【難易度】${params.difficulty}
【難易度ガイドライン】${DIFFICULTY_GUIDELINES[params.difficulty]}
【サイズ感】${params.size ?? "standard"}
【保有パーツ】
${partsLines}
【任意メモ】
${params.notes ?? ""}

上記条件で、オリジナル作品案を 1 件生成してください。`;
}
