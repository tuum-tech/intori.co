// pages/api/dev/flags.ts
import type { NextApiRequest, NextApiResponse } from "next";

const present = (v?: string) => (v && v.length >= 4 ? "present" : "missing");

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    ok: true,
    NODE_ENV: process.env.NODE_ENV || "unknown",

    // Safe to show literal value (client-exposed flag)
    NEXT_PUBLIC_INTORI_DEV_PAGES: process.env.NEXT_PUBLIC_INTORI_DEV_PAGES ?? "undefined",

    // Presence-only for sensitive values
    DATABASE_URL: present(process.env.DATABASE_URL),
    DATABASE_PRISMA_DATABASE_URL: present(process.env.DATABASE_PRISMA_DATABASE_URL),
    OPENAI_API_KEY: present(process.env.OPENAI_API_KEY),

    // Server-only feature flags (stringified)
    INTORI_AI_SUMMARY_ENABLED: String(process.env.INTORI_AI_SUMMARY_ENABLED ?? "true"),
    INTORI_CLUSTERS_ENABLED: String(process.env.INTORI_CLUSTERS_ENABLED ?? "true"),
    INTORI_FEED_NARRATIVES_ENABLED: String(process.env.INTORI_FEED_NARRATIVES_ENABLED ?? "true"),
  });
}
