import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { evaluateEligibility } from "@/lib/ai/eligibility";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const payload = (req.body ?? {}) as {
      icebreakers?: Record<string, string>;
      insights?: Array<{ question: string; answer: string }>;
    };

    const clusters = await prisma.cluster.findMany({
      orderBy: [{ priority: "desc" }, { slug: "asc" }],
      // select minimal fields to keep payload small
      select: { slug: true, label: true, priority: true, unlockRules: true },
    });

    const results = clusters.map((c) => {
      const rules = (c.unlockRules ?? {}) as any;
      const r = evaluateEligibility(payload, rules);
      return {
        id: c.slug,
        label: c.label,
        priority: c.priority ?? 0,
        eligible: r.eligible,
        qualifying: r.qualifying,
        score: r.score,
      };
    });

    res.status(200).json({ ok: true, count: results.length, results });
  } catch (err) {
    console.error("eligibility error", err);
    res.status(500).json({ ok: false, error: "Internal error" });
  }
}
