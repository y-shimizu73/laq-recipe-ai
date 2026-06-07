export type Difficulty = "初級" | "中級" | "上級";
export type Size = "compact" | "standard" | "large";
export type Confidence = "high" | "medium" | "low";

export type PartInput = {
  color: string;
  type: string;
  count: number;
};

export type ManualRecipeRequest = {
  genre: string;
  difficulty: Difficulty;
  size?: Size;
  parts: PartInput[];
  notes?: string;
};

export type PartEstimate = {
  color: string;
  type: string;
  count: string;
  note?: string | null;
};

export type RecipeStep = {
  step: number;
  title: string;
  instruction: string;
  tips?: string | null;
};

export type SuggestedAddition = {
  color: string;
  type: string;
  count: string;
  reason: string;
};

export type RecipeResult = {
  feasible: boolean;
  title: string;
  concept: string;
  difficulty: Difficulty;
  estimated_time_minutes: number;
  confidence: Confidence;
  parts_estimate: PartEstimate[];
  steps: RecipeStep[];
  structure_notes?: string | null;
  suggested_additions?: SuggestedAddition[];
  warnings?: string[];
};

export type ManualRecipeResponse = {
  job_id: string;
  status: "completed";
  result: RecipeResult;
  created_at: string;
};
