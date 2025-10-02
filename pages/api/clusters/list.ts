import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/clusters/list
 * Returns a small list of clusters so we can copy a real clusterId.
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const clusters = await prisma.cluster.findMany({
      select: { id: true, slug: true, label: true, priority: true, autoJoin: true },
      orderBy: [{ priority: "desc" }, { label: "asc" }],
      take: 50,
    });

    return res.status(200).json({ ok: true, count: clusters.length, clusters });
  } catch (err: any) {
    console.error("List clusters error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
