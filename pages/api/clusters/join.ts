import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    const { fid, clusterId } = req.body as { fid?: number; clusterId?: string };

    if (!fid || !clusterId) return res.status(400).json({ ok: false, error: "Missing fid or clusterId" });

    // Verify cluster exists
    const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } });
    if (!cluster) return res.status(404).json({ ok: false, error: "Cluster not found." });

    // Ensure user exists (minimal)
    await prisma.userProfile.upsert({
      where: { fid },
      update: {},
      create: {
        fid,
        power_badge: false,
        username: `fid_${fid}`,
        bio: "",
      },
    });

    await prisma.userCluster.upsert({
      where: { userFid_clusterId: { userFid: fid, clusterId } },
      update: { activeAt: new Date() },
      create: { userFid: fid, clusterId },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error("Join cluster error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
