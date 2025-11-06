// pages/api/ai/eligibility.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  evaluateEligibility,
  type EligibilityAnswers,
  type UnlockRules,
} from "@/lib/ai/eligibility";

type Ok = {
  ok: true;
  fid: number;
  results: Array<{
    id: string;
    slug: string;
    label: string;
    priority: number;
    eligible: boolean;      // derived by evaluator
    qualifying: number;     // evaluator's qualifying count
    score: number;          // evaluator's score
  }>;
};

type Err = { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const { fid, answers } = (req.body ?? {}) as {
    fid?: number | string;
    answers?: unknown;
  };

  const fidNum = parseInt(String(fid ?? ""), 10);
  if (!fidNum || Number.isNaN(fidNum)) {
    return res.status(400).json({ ok: false, error: "Missing or invalid fid" });
  }

  if (answers === undefined || answers === null || typeof answers !== "object") {
    return res.status(400).json({ ok: false, error: "Provide `answers` object in body" });
  }

  try {
    const clusters = await prisma.cluster.findMany({
      select: {
        id: true,
        slug: true,
        label: true,
        priority: true,
        unlockRules: true,
      },
      orderBy: [{ priority: "desc" }, { label: "asc" }],
    });

    const typedAnswers = answers as EligibilityAnswers;

    const results = clusters.map((c) => {
      const rules = (c.unlockRules || {}) as UnlockRules;
      const { eligible, qualifying, score } = evaluateEligibility(typedAnswers, rules);

      return {
        id: c.id,
        slug: c.slug,
        label: c.label,
        priority: c.priority ?? 0,
        eligible,
        qualifying,
        score,
      };
    });

    return res.status(200).json({ ok: true, fid: fidNum, results });
  } catch (e) {
    console.error("eligibility route error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
