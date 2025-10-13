// pages/api/dev/flags.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // No gating here—this route is always visible so you can debug flags
  const nextPublic = process.env.NEXT_PUBLIC_INTORI_DEV_PAGES;
  const serverOnly = process.env.INTORI_DEV_PAGES;
  const openai = process.env.OPENAI_API_KEY ? "present" : "missing";
  const db = process.env.DATABASE_URL ? "present" : "missing";
  const prodDb = process.env.PROD_DATABASE_URL ? "present" : "missing";

  res.status(200).json({
    ok: true,
    NODE_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_INTORI_DEV_PAGES: nextPublic ?? "undefined",
    INTORI_DEV_PAGES: serverOnly ?? "undefined",
    DATABASE_URL: db,
    PROD_DATABASE_URL: prodDb,
    OPENAI_API_KEY: openai,
  });
}
