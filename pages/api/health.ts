import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    DATABASE_PRISMA_DATABASE_URL: process.env.DATABASE_PRISMA_DATABASE_URL
      ? "present"
      : "missing",
    DATABASE_URL: process.env.DATABASE_URL ? "present" : "missing",
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    BRANCH: process.env.VERCEL_GIT_COMMIT_REF,
  });
}
