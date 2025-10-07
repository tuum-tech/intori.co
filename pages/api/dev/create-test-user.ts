import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Dev helper
 * - GET /api/dev/create-test-user?fid=1234&username=dev1234&displayName=Dev
 * - POST /api/dev/create-test-user  { fid, username?, displayName?, pfp_url? }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const devEnabled = process.env.NEXT_PUBLIC_INTORI_DEV_PAGES === "true";
  if (!devEnabled) {
    return res.status(403).json({ ok: false, error: "Dev-only endpoint is disabled" });
  }

  try {
    let fid: number | undefined;
    let username: string | undefined;
    let displayName: string | undefined;
    let pfp_url: string | undefined;

    if (req.method === "GET") {
      const q = req.query || {};
      fid = typeof q.fid === "string" ? parseInt(q.fid, 10) : undefined;
      username = typeof q.username === "string" ? q.username : undefined;
      displayName = typeof q.displayName === "string" ? q.displayName : undefined;
      pfp_url = typeof q.pfp_url === "string" ? q.pfp_url : undefined;
    } else if (req.method === "POST") {
      const b = req.body || {};
      fid = b.fid;
      username = b.username;
      displayName = b.displayName;
      pfp_url = b.pfp_url;
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    if (typeof fid !== "number" || !Number.isInteger(fid)) {
      return res.status(400).json({ ok: false, error: "Invalid fid. Provide an integer fid." });
    }

    console.log("[create-test-user] upsert start", { fid, username, displayName });

    const user = await prisma.userProfile.upsert({
      where: { fid },
      update: {
        display_name: displayName ?? undefined,
        username: username ?? undefined,
        pfp_url: pfp_url ?? undefined,
      },
      create: {
        fid,
        power_badge: false,
        username: username ?? `user${fid}`,
        bio: "",
        display_name: displayName ?? null,
        pfp_url: pfp_url ?? null,
      },
    });

    console.log("[create-test-user] upsert ok", { fid: user.fid, username: user.username });

    return res.status(200).json({ ok: true, user });
  } catch (err: any) {
    console.error("[create-test-user] error", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
