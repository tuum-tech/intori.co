// pages/api/ai/summary/[fid].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type Ok =
  | {
      ok: true;
      fid: number;
      found: true;
      summary: string;
      source: string;
      generatedAt: string; // ISO
    }
  | {
      ok: true;
      fid: number;
      found: false;
    };

type Err = { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  // Same dev safety guard as POST
  const devAllowed =
    process.env.NODE_ENV === "development" ||
    process.env.INTORI_DEV_PAGES === "true";

  if (!devAllowed) {
    return res
      .status(403)
      .json({ ok: false, error: "AI summary endpoint disabled in this environment." });
  }

  const { fid } = req.query;
  const fidNum = Number(fid);

  if (!fid || Number.isNaN(fidNum)) {
    return res.status(400).json({ ok: false, error: "Invalid fid" });
  }

  try {
    const s = await prisma.userSummary.findUnique({
      where: { userFid: fidNum },
      select: { summaryText: true, source: true, generatedAt: true },
    });

    if (!s) {
      return res.status(200).json({ ok: true, fid: fidNum, found: false });
    }

    return res.status(200).json({
      ok: true,
      fid: fidNum,
      found: true,
      summary: s.summaryText,
      source: s.source,
      generatedAt: s.generatedAt.toISOString(),
    });
  } catch (e) {
    console.error("GET /api/ai/summary/[fid] error:", e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
