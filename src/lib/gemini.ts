import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { GEMINI_MODEL } from "./constants";
import type { RecipeResult } from "./types";

export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiError";
  }
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateRecipeJson(
  systemInstruction: string,
  userPrompt: string,
  responseSchema: object,
  thinkingLevel: ThinkingLevel = ThinkingLevel.MEDIUM,
): Promise<RecipeResult> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? GEMINI_MODEL,
    contents: userPrompt,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingLevel },
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new GeminiError("Empty response from Gemini");
  }

  let parsed: RecipeResult;
  try {
    parsed = JSON.parse(text) as RecipeResult;
  } catch {
    throw new GeminiError("Invalid JSON from Gemini");
  }

  if (!parsed.steps || parsed.steps.length !== 3) {
    throw new GeminiError("Recipe must contain exactly 3 steps");
  }

  return parsed;
}
