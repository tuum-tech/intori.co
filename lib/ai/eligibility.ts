// lib/ai/eligibility.ts

/**
 * Simple, explicit rules for deciding whether a user qualifies for a cluster.
 * - We look up answers by question_key inside an "icebreakers" bag
 * - A signal qualifies if the answer is in `in` (and NOT in `not_in`, if provided)
 * - `boost` lets you give extra weight to a qualifying signal
 */

export type RuleSignal = {
  type: "icebreaker";
  question_key: string;
  in?: string[];      // answer must be in this set (case-insensitive compare)
  not_in?: string[];  // optional: disqualify if in this set
  boost?: number;     // optional: extra weight if it qualifies
};

export type UnlockRules = {
  min_signals?: number; // minimum total score required (default 1)
  signals?: RuleSignal[];
};

function normalize(s: unknown) {
  return String(s ?? "").trim().toLowerCase();
}

/** Returns the user's answer for a given key, supporting both flat and nested shapes */
function getIcebreakerAnswer(
  answers: any,
  key: string
): string | undefined {
  if (!answers) return undefined;

  // Support shapes like { icebreakers: { q16_x: "Sports Game" } }
  if (answers.icebreakers && key in answers.icebreakers) {
    return answers.icebreakers[key];
  }

  // or flat { q16_x: "Sports Game" }
  if (key in answers) return answers[key];

  return undefined;
}

/** Count of qualifying signals (each qualifying signal = 1) */
export function evaluateEligibility(
  answers: any,
  rules: UnlockRules
): number {
  if (!rules || !Array.isArray(rules.signals) || rules.signals.length === 0) {
    return 0;
  }

  let qualifying = 0;

  for (const sig of rules.signals) {
    if (sig.type !== "icebreaker") continue;

    const raw = getIcebreakerAnswer(answers, sig.question_key);
    if (raw == null) continue;

    const val = normalize(raw);

    // If `in` is provided, val must be in it
    if (sig.in && sig.in.length > 0) {
      const allowed = sig.in.map(normalize);
      if (!allowed.includes(val)) continue;
    }

    // If `not_in` provided, reject if val is in it
    if (sig.not_in && sig.not_in.length > 0) {
      const banned = sig.not_in.map(normalize);
      if (banned.includes(val)) continue;
    }

    qualifying += 1;
  }

  return qualifying;
}

/** Weighted score: each qualifying signal = 1 + boost (if provided) */
export function scoreEligibility(
  answers: any,
  rules: UnlockRules
): number {
  if (!rules || !Array.isArray(rules.signals) || rules.signals.length === 0) {
    return 0;
  }

  let score = 0;

  for (const sig of rules.signals) {
    if (sig.type !== "icebreaker") continue;

    const raw = getIcebreakerAnswer(answers, sig.question_key);
    if (raw == null) continue;

    const val = normalize(raw);

    // pass "in" gate
    if (sig.in && sig.in.length > 0) {
      const allowed = sig.in.map(normalize);
      if (!allowed.includes(val)) continue;
    }

    // fail "not_in" gate
    if (sig.not_in && sig.not_in.length > 0) {
      const banned = sig.not_in.map(normalize);
      if (banned.includes(val)) continue;
    }

    score += 1 + (sig.boost ?? 0);
  }

  return score;
}

/** Convenience: did the user reach the min_signals threshold? */
export function meetsThreshold(
  answers: any,
  rules: UnlockRules
) {
  const min = rules?.min_signals ?? 1;
  return scoreEligibility(answers, rules) >= min;
}
