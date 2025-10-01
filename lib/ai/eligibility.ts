export type Signal = {
  type: "icebreaker" | "insight";
  question?: string;        // for insight rules
  question_key?: string;    // for icebreaker rules
  in?: string[];
  disqualify?: string[];
  weight?: number;
};

export type UnlockRules = {
  min_signals: number;
  signals: Signal[];
  boost_signals?: Signal[];
};

type UserAnswers = {
  icebreakers?: Record<string, string>;
  insights?: Array<{ question: string; answer: string }>;
};

function passesSignal(ans: UserAnswers, s: Signal): boolean {
  if (s.type === "icebreaker" && s.question_key) {
    const a = ans.icebreakers?.[s.question_key];
    if (!a) return false;
    if (s.disqualify?.includes(a)) return false;
    return s.in ? s.in.includes(a) : true;
  }
  if (s.type === "insight" && s.question) {
    const hit = (ans.insights || []).find(
      (i) => i.question?.toLowerCase() === s.question!.toLowerCase()
    );
    if (!hit) return false;
    const a = (hit.answer || "").trim();
    if (s.disqualify?.includes(a)) return false;
    return s.in ? s.in.includes(a) : true;
  }
  return false;
}

export function evaluateEligibility(
  answers: UserAnswers,
  rules: UnlockRules
): { qualifying: number; score: number; eligible: boolean } {
  const qualifying = (rules.signals || []).reduce(
    (n, s) => n + (passesSignal(answers, s) ? 1 : 0),
    0
  );

  const score = (rules.boost_signals || []).reduce(
    (n, s) => n + (passesSignal(answers, s) ? (s.weight ?? 1) : 0),
    0
  );

  const eligible = qualifying >= (rules.min_signals ?? 1);
  return { qualifying, score, eligible };
}
