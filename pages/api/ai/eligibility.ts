// pages/api/ai/eligibility.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
// ⬇️ Import the actual types from your lib to keep TS consistent
import {
  evaluateEligibility,
  type UnlockRules as EligibilityUnlockRules,
} from "@/lib/ai/eligibility";

type Data =
  | {
      ok: true;
      fid: number;
      results: Array<{
        id: string;
        slug: string;
        label: string;
        priority: number;
        eligible: boolean;
        qualifying: number;
        score: number;
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
      // Use the lib’s type to satisfy TS
      const rules = (c.unlockRules || {}) as EligibilityUnlockRules;
      const evalResult = evaluateEligibility(answers as any, rules);

      return {
        id: c.id,
        slug: c.slug,
        label: c.label,
        priority: c.priority ?? 0,
        eligible: evalResult.eligible,
        qualifying: evalResult.qualifying,
        score: evalResult.score,
      };
    });

    return res.status(200).json({ ok: true, fid, results });
  } catch (e) {
    console.error("eligibility route error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
