// pages/api/meet/suggestions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/meet/suggestions?fid=1234&limit=20
 * Returns users who share ≥1 cluster with fid, ranked by shared cluster count.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fid = parseInt(String(req.query.fid ?? ""), 10);
    if (!Number.isInteger(fid)) return res.status(400).json({ ok: false, error: "Missing or invalid fid" });

    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? "20"), 10) || 20));

    // Clusters current user has joined
    const myMemberships = await prisma.userCluster.findMany({
      where: { userFid: fid },
      select: { clusterId: true },
    });
    const myClusterIds = myMemberships.map(m => m.clusterId);
    if (myClusterIds.length === 0) {
      return res.status(200).json({ ok: true, fid, candidates: [], reason: "User has no joined clusters" });
    }

    // Other users in those clusters
    const others = await prisma.userCluster.findMany({
      where: { clusterId: { in: myClusterIds }, userFid: { not: fid } },
      select: { userFid: true, clusterId: true },
      take: 5000, // cap for safety
    });

    // Count overlap
    const overlapMap = new Map<number, Set<string>>();
    for (const row of others) {
      if (!overlapMap.has(row.userFid)) overlapMap.set(row.userFid, new Set());
      overlapMap.get(row.userFid)!.add(row.clusterId);
    }

    // Build scored list
    const scored = Array.from(overlapMap.entries()).map(([otherFid, set]) => ({
      fid: otherFid,
      sharedCount: set.size,
      sharedClusterIds: Array.from(set),
    }));

    // Sort by shared clusters desc
    scored.sort((a, b) => b.sharedCount - a.sharedCount);

    // Slice & hydrate with profile + cluster meta
    const top = scored.slice(0, limit);
    const fids = top.map(t => t.fid);

    const profiles = await prisma.userProfile.findMany({
      where: { fid: { in: fids } },
      select: { fid: true, display_name: true, username: true, pfp_url: true, bio: true },
    });
    const profileMap = new Map(profiles.map(p => [p.fid, p]));

    const clusters = await prisma.cluster.findMany({
      where: { id: { in: Array.from(new Set(top.flatMap(t => t.sharedClusterIds))) } },
      select: { id: true, label: true, slug: true, emoji: true },
    });
    const clusterMap = new Map(clusters.map(c => [c.id, c]));

    const candidates = top.map(item => ({
      fid: item.fid,
      profile: profileMap.get(item.fid) ?? null,
      sharedCount: item.sharedCount,
      sharedClusters: item.sharedClusterIds.map(id => clusterMap.get(id)).filter(Boolean),
    }));

    return res.status(200).json({ ok: true, fid, total: candidates.length, candidates });
  } catch (err: any) {
    console.error("meet suggestions error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
