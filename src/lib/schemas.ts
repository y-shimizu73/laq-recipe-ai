import { Type } from "@google/genai";

export const RECIPE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: [
    "feasible",
    "title",
    "concept",
    "difficulty",
    "estimated_time_minutes",
    "confidence",
    "parts_estimate",
    "steps",
  ],
  properties: {
    feasible: { type: Type.BOOLEAN },
    title: { type: Type.STRING },
    concept: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ["初級", "中級", "上級"] },
    estimated_time_minutes: { type: Type.INTEGER },
    confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
    parts_estimate: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["color", "type", "count"],
        properties: {
          color: { type: Type.STRING },
          type: { type: Type.STRING },
          count: { type: Type.STRING },
          note: { type: Type.STRING },
        },
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["step", "title", "instruction"],
        properties: {
          step: { type: Type.INTEGER },
          title: { type: Type.STRING },
          instruction: { type: Type.STRING },
          tips: { type: Type.STRING },
        },
      },
    },
    structure_notes: { type: Type.STRING },
    suggested_additions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          color: { type: Type.STRING },
          type: { type: Type.STRING },
          count: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
      },
    },
    warnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
};
