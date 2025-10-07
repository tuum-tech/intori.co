// pages/api/ai/eligibility.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { evaluateEligibility } from "@/lib/ai/eligibility"; // no type import

// … same Data type as above …

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const { fid, answers } = req.body as { fid?: number; answers?: unknown };

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
      // If the lib’s RuleSignal type is narrower than your JSON,
      // bypass TS here (the lib should validate at runtime).
      const evalResult = evaluateEligibility(
        answers as any,
        c.unlockRules as any // <— deliberate cast to avoid TS mismatch
      );

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
