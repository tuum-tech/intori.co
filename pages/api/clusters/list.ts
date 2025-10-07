import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method Not Allowed" });

  try {
    const clusters = await prisma.cluster.findMany({
      orderBy: { priority: "desc" },
    });
    return res.json({ ok: true, clusters });
  } catch (e) {
    console.error("List clusters error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
