// lib/ai/prompt.ts

export type IcebreakerAnswers = Record<string, unknown>;

export type VIPInsight = {
  answerId: string;
  question?: string;
  answer: string;
  rating: number; // 1..3 (3 = very important)
};

/**
 * Build a concise prompt for the model from icebreakers + optional VIP insights.
 * Keep it deterministic and safe (no PII, no instruction leakage).
 */
export function buildIcebreakerSummaryPrompt(
  icebreakers: IcebreakerAnswers,
  vipInsights: VIPInsight[] = [],
): string {
  const lines: string[] = [];

  lines.push(
    "You are writing a short, friendly profile intro for a social app.",
    "Write 1–2 sentences (max ~120 words total), conversational, positive, and specific.",
    "Avoid repeating the exact question text; synthesize a vibe. No emojis. No hashtags.",
  );

  // Icebreakers block
  try {
    const entries = Object.entries(icebreakers || {});
    if (entries.length > 0) {
      lines.push("", "Icebreakers (key: value):");
      for (const [k, v] of entries) {
        const val =
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean"
            ? String(v)
            : Array.isArray(v)
              ? v.join(", ")
              : JSON.stringify(v);
        lines.push(`- ${k}: ${val}`);
      }
    }
  } catch {
    // ignore formatting failures; prompt still usable
  }

  // VIP insights block (rating 3 only)
  const vipTop = (vipInsights || []).filter((i) => i.rating === 3);
  if (vipTop.length > 0) {
    lines.push("", "Very important insights (user-rated):");
    for (const i of vipTop) {
      lines.push(`- ${i.answer}`);
    }
  }

  lines.push(
    "",
    "Return only the final paragraph—no preamble, no bullet points, no labels.",
  );

  return lines.join("\n");
}

/**
 * Extended summary builder (alias).
 * Right now this is the same as buildIcebreakerSummaryPrompt,
 * but allows future custom handling if we add more sources.
 */
export function buildExtendedSummaryPrompt(
  icebreakers: IcebreakerAnswers,
  vipInsights: VIPInsight[] = [],
): string {
  return buildIcebreakerSummaryPrompt(icebreakers, vipInsights);
}
