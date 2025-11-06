// pages/api/clusters/auto-join.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  evaluateEligibility,
  type EligibilityAnswers,
  type UnlockRules,
} from "@/lib/ai/eligibility";

type Data =
  | {
      ok: true;
      fid: number;
      joined: Array<{ id: string; slug: string }>;
      already: Array<{ id: string; slug: string }>;
      skipped: Array<{ id: string; slug: string; reason: string }>;
      details?: Array<{ id: string; slug: string; qualifying: number; score: number }>;
    }
  | { ok: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const {
      fid,
      answers = {},
      dryRun = false,
      includeDetails = false,
    }: {
      fid?: number | string;
      answers?: unknown;
      dryRun?: boolean;
      includeDetails?: boolean;
    } = req.body || {};

    const fidNum = parseInt(String(fid ?? ""), 10);
    if (!fidNum || Number.isNaN(fidNum)) {
      return res.status(400).json({ ok: false, error: "Bad request: missing or invalid fid" });
    }

    // Require an existing user; this endpoint only manages memberships.
    const user = await prisma.userProfile.findUnique({ where: { fid: fidNum } });
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found. Create a test user first." });
    }

    const [clusters, memberships] = await Promise.all([
      prisma.cluster.findMany({ orderBy: { priority: "desc" } }),
      prisma.userCluster.findMany({ where: { userFid: fidNum } }),
    ]);

    const currentIds = new Set(memberships.map((m) => m.clusterId));

    const toJoin: string[] = [];
    const joined: Array<{ id: string; slug: string }> = [];
    const already: Array<{ id: string; slug: string }> = [];
    const skipped: Array<{ id: string; slug: string; reason: string }> = [];
    const details: Array<{ id: string; slug: string; qualifying: number; score: number }> = [];

    for (const c of clusters) {
      const rules = (c.unlockRules || {}) as UnlockRules;

      const result = evaluateEligibility(answers as EligibilityAnswers, rules);
      const { eligible, qualifying, score } = result;

      if (includeDetails) {
        details.push({ id: c.id, slug: c.slug, qualifying, score });
      }

      if (!eligible) {
        skipped.push({ id: c.id, slug: c.slug, reason: "No qualifying signals" });
        continue;
      }

      if (currentIds.has(c.id)) {
        already.push({ id: c.id, slug: c.slug });
        continue;
      }

      toJoin.push(c.id);
    }

    if (!dryRun && toJoin.length > 0) {
      await prisma.$transaction(
        toJoin.map((clusterId) =>
          prisma.userCluster.upsert({
            where: { userFid_clusterId: { userFid: fidNum, clusterId } },
            create: { userFid: fidNum, clusterId },
            update: {}, // no-op if it exists
          })
        )
      );

      joined.push(
        ...clusters
          .filter((c) => toJoin.includes(c.id))
          .map((c) => ({ id: c.id, slug: c.slug }))
      );
    }

    return res.status(200).json({
      ok: true,
      fid: fidNum,
      joined,
      already,
      skipped,
      ...(includeDetails ? { details } : {}),
    });
  } catch (err: unknown) {
    console.error("auto-join error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
