import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  const fid = parseInt((req.query.fid as string) ?? "0", 10);
  if (!fid) return res.status(400).json({ ok: false, error: "Bad fid" });

  try {
    const [memberships, all] = await Promise.all([
      prisma.userCluster.findMany({
        where: { userFid: fid },
        select: { clusterId: true },
      }),
      prisma.cluster.findMany({ orderBy: { priority: "desc" } }),
    ]);

    const joinedIds = new Set(memberships.map((m) => m.clusterId));
    const clusters = all.map((c) => ({
      ...c,
      joined: joinedIds.has(c.id),
    }));

    return res.json({ ok: true, clusters });
  } catch (e) {
    console.error("List clusters for user error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
