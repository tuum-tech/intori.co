import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import type { Cluster } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  const fid = parseInt((req.query.fid as string) ?? "0", 10);
  if (!fid) return res.status(400).json({ ok: false, error: "Bad fid" });

  try {
    const [all, memberships] = await Promise.all([
      prisma.cluster.findMany({ orderBy: { priority: "desc" } }),
      prisma.userCluster.findMany({ where: { userFid: fid }, select: { clusterId: true } }),
    ]);
    const joined = new Set(memberships.map((m) => m.clusterId));

    const clusters = all.map((c: Cluster) => ({
      id: c.id,
      slug: c.slug,
      label: c.label,
      emoji: c.emoji,
      priority: c.priority,
      autoJoin: c.autoJoin,
      joined: joined.has(c.id),
      eligible: false,      // TODO: wire real evaluation
      signalsMatched: 0,
      signalsRequired: 0,
      boostCount: 0,
      debug: [],
    }));

    return res.json({ ok: true, clusters });
  } catch (e) {
    console.error("Eligibility error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
