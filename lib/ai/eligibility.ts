// lib/ai/eligibility.ts

/**
 * Shapes used by cluster unlock rules.
 * Keep this in sync with what's stored in Cluster.unlockRules (JSON).
 */

export type RuleSignal =
  | {
      type: "icebreaker";
      /** key in answers.icebreakers, e.g. "q16_concert_or_sports" */
      question_key: string;
      /** value must be one of these to qualify (optional) */
      in?: (string | number | boolean)[];
      /** value must NOT be any of these to qualify (optional) */
      not_in?: (string | number | boolean)[];
    }
  | {
      type: "topic";
      /** a topic string the user must have among their topics */
      topic: string;
    };

export type UnlockRules = {
  /** how many signals must qualify to be eligible (default: 1) */
  min_signals?: number;
  /** list of signals to check */
  signals?: RuleSignal[];
};

export type EligibilityAnswers = {
  icebreakers?: Record<string, unknown>;
  /** optional list of inferred or explicit user topics */
  topics?: string[];
};

export type EligibilityResult = {
  eligible: boolean;
  /** count of signals that qualified */
  qualifying: number;
  /** numeric score for sorting; for now equal to `qualifying` */
  score: number;
};

/**
 * Evaluate a user's answers against unlock rules.
 */
export function evaluateEligibility(
  answers: EligibilityAnswers,
  rules: UnlockRules
): EligibilityResult {
  const required = Math.max(1, rules?.min_signals ?? 1);
  const signals = rules?.signals ?? [];

  let qualifying = 0;

  for (const sig of signals) {
    if (sig.type === "icebreaker") {
      const v = answers?.icebreakers?.[sig.question_key];

      // If there's no value for the question, this signal can't qualify
      if (typeof v === "undefined" || v === null) continue;

      const val =
        typeof v === "string" || typeof v === "number" || typeof v === "boolean"
          ? v
          : Array.isArray(v)
          ? v.join(", ")
          : JSON.stringify(v);

      // If `in` is provided, value must be in it.
      if (sig.in && !sig.in.includes(val as string | number | boolean)) continue;
      // If `not_in` is provided, value must NOT be in it.
      if (sig.not_in && sig.not_in.includes(val as string | number | boolean)) continue;

      qualifying += 1;
    } else if (sig.type === "topic") {
      const set = new Set((answers?.topics ?? []).map((t) => String(t).toLowerCase()));
      if (set.has(sig.topic.toLowerCase())) {
        qualifying += 1;
      }
    }
  }

  const eligible = qualifying >= required;
  return { eligible, qualifying, score: qualifying };
}

/**
 * Convenience: just return a numeric score for sorting/ranking.
 */
export function scoreEligibility(
  answers: EligibilityAnswers,
  rules: UnlockRules
): number {
  return evaluateEligibility(answers, rules).score;
}
