// pages/api/ai/eligibility.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { scoreEligibility } from "@/lib/ai/eligibility"; // returns a number

type Data =
  | {
      ok: true;
      fid: number;
      results: Array<{
        id: string;
        slug: string;
        label: string;
        priority: number;
        eligible: boolean;   // derived from score >= min_signals
        qualifying: number;  // equal to score
        score: number;       // same as qualifying
      }>;
    }
  | { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const { fid, answers } = req.body as {
    fid?: number;
    answers?: unknown;
  };

  if (!fid || typeof fid !== "number") {
    return res.status(400).json({ ok: false, error: "Missing or invalid fid" });
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

    const results = clusters.map((c) => {
      const rules = (c.unlockRules || {}) as any;
      const minSignals =
        typeof rules?.min_signals === "number" ? rules.min_signals : 1;

      // scoreEligibility(answers, rules) -> number of matching signals
      const score = scoreEligibility(answers as any, rules);

      return {
        id: c.id,
        slug: c.slug,
        label: c.label,
        priority: c.priority ?? 0,
        eligible: score >= minSignals, // derive eligibility from score
        qualifying: score,             // keep both for UI/debug
        score,
      };
    });

    return res.status(200).json({ ok: true, fid, results });
  } catch (e) {
    console.error("eligibility route error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
