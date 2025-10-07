import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_INTORI_DEV_PAGES !== "true") {
    return res.status(403).json({ ok: false, error: "Dev-only endpoints disabled" });
  }
  return res.status(200).json({ ok: true, msg: "pong" });
}
