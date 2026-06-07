import { generateRecipeJson } from "./gemini";
import { ThinkingLevel } from "@google/genai";
import { buildManualUserPrompt, SYSTEM_PROMPT } from "./prompts";
import { RECIPE_RESPONSE_SCHEMA } from "./schemas";
import type { ManualRecipeRequest, RecipeResult } from "./types";

export async function generateManualRecipe(
  params: ManualRecipeRequest,
): Promise<RecipeResult> {
  const userPrompt = buildManualUserPrompt(params);

  return generateRecipeJson(
    SYSTEM_PROMPT,
    userPrompt,
    RECIPE_RESPONSE_SCHEMA,
    ThinkingLevel.MEDIUM,
  );
}
