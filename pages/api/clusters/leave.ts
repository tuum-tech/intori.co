import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    const { fid, clusterId } = req.body as { fid?: number; clusterId?: string };

    if (!fid || !clusterId) return res.status(400).json({ ok: false, error: "Missing fid or clusterId" });

    await prisma.userCluster.delete({
      where: { userFid_clusterId: { userFid: fid, clusterId } },
    }).catch(() => null); // ignore if not joined

    return res.json({ ok: true });
  } catch (e) {
    console.error("Leave cluster error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
