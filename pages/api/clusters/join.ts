import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/clusters/join
 * Body: { fid: number, clusterId: string }
 *
 * Upserts a row in UserCluster using (userFid, clusterId) composite ID.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { fid, clusterId } = req.body || {};

    if (typeof fid !== "number" || !Number.isInteger(fid) || !clusterId || typeof clusterId !== "string") {
      return res.status(400).json({ ok: false, error: "Invalid body. Expected { fid: number, clusterId: string }" });
    }

    // Ensure cluster exists
    const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } });
    if (!cluster) {
      return res.status(404).json({ ok: false, error: "Cluster not found" });
    }

    // Upsert membership
    const membership = await prisma.userCluster.upsert({
      where: { userFid_clusterId: { userFid: fid, clusterId } },
      create: { userFid: fid, clusterId, joinedAt: new Date(), activeAt: new Date() },
      update: { activeAt: new Date() },
    });

    // Optional: create a feed event
    await prisma.feedEvent.create({
      data: {
        type: "cluster_joined",
        actorId: String(fid),
        payload: { clusterId, label: cluster.label, slug: cluster.slug },
      },
    });

    return res.status(200).json({ ok: true, membership });
  } catch (err: any) {
    console.error("Join cluster error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
