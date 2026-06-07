import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { GENRES, DIFFICULTIES } from "@/lib/constants";
import { GeminiError } from "@/lib/gemini";
import { generateManualRecipe } from "@/lib/recipe-generator";
import type { Difficulty, ManualRecipeRequest, PartInput, Size } from "@/lib/types";

function validateRequest(body: unknown): ManualRecipeRequest {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Invalid request body");
  }

  const data = body as Record<string, unknown>;

  const genre = String(data.genre ?? "").trim();
  if (!genre || !GENRES.includes(genre as (typeof GENRES)[number])) {
    throw new ValidationError("genre is required and must be valid");
  }

  const difficulty = String(data.difficulty ?? "") as Difficulty;
  if (!DIFFICULTIES.includes(difficulty)) {
    throw new ValidationError("difficulty must be 初級, 中級, or 上級");
  }

  const size = (data.size as Size | undefined) ?? "standard";
  if (!["compact", "standard", "large"].includes(size)) {
    throw new ValidationError("size must be compact, standard, or large");
  }

  if (!Array.isArray(data.parts) || data.parts.length === 0) {
    throw new ValidationError("parts must contain at least one item");
  }

  const parts: PartInput[] = data.parts.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new ValidationError(`parts[${index}] is invalid`);
    }
    const part = item as Record<string, unknown>;
    const color = String(part.color ?? "").trim();
    const type = String(part.type ?? "").trim();
    const count = Number(part.count);

    if (!color || !type) {
      throw new ValidationError(`parts[${index}] requires color and type`);
    }
    if (!Number.isFinite(count) || count < 1 || count > 9999) {
      throw new ValidationError(`parts[${index}].count must be between 1 and 9999`);
    }

    return { color, type, count: Math.floor(count) };
  });

  const notes =
    typeof data.notes === "string" ? data.notes.trim().slice(0, 500) : undefined;

  return { genre, difficulty, size, parts, notes };
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const params = validateRequest(body);
    const result = await generateManualRecipe(params);

    const response = {
      job_id: randomUUID(),
      status: "completed" as const,
      result,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: error.message } },
        { status: 400 },
      );
    }

    if (error instanceof GeminiError) {
      return NextResponse.json(
        {
          error: {
            code: "GENERATION_FAILED",
            message: "作品案の生成に失敗しました。条件を変更して再試行してください。",
          },
        },
        { status: 422 },
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}
