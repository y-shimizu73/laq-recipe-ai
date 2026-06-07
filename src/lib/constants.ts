export const GENRES = [
  "乗り物",
  "恐竜",
  "動物",
  "建築",
  "機械",
  "抽象",
  "キャラ",
] as const;

export const DIFFICULTIES = ["初級", "中級", "上級"] as const;

export const SIZES = [
  { value: "compact", label: "コンパクト" },
  { value: "standard", label: "標準" },
  { value: "large", label: "大型" },
] as const;

export const PART_TYPES = [
  "スクエア 3×3",
  "スクエア 5×5",
  "トライアングル 3×3",
  "トライアングル 5×5",
  "ジョイント 2-way",
  "ジョイント 3-way",
  "ホイール 小",
  "ホイール 大",
] as const;

export const COLORS = [
  "赤",
  "青",
  "黄",
  "緑",
  "黒",
  "白",
  "橙",
  "紫",
  "灰",
  "茶",
] as const;

export const GEMINI_MODEL = "gemini-3.5-flash";
