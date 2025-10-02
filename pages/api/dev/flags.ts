import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const nextPublic = process.env.NEXT_PUBLIC_INTORI_DEV_PAGES;
  const serverOnly = process.env.INTORI_DEV_PAGES;

  res.status(200).json({
    ok: true,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_INTORI_DEV_PAGES: nextPublic ?? "undefined",
    INTORI_DEV_PAGES: serverOnly ?? "undefined",
  });
}
