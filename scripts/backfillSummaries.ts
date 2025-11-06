// scripts/backfillSummaries.ts
//
// Backfills UserSummary for active users.
// - Picks candidate FIDs with >= MIN_ANSWERS UserAnswer rows
// - Pulls recent answers as "icebreakers"
// - Pulls VIP insights (InsightRating.rating = 3) and includes their text
// - Calls OpenAI (when DRY_RUN=false) to generate a 1–2 sentence summary
// - Upserts into UserSummary (keyed by userFid)
//
// Env you may set when running (all optional unless noted):
//   USE_PROD_DB=true                -> switch to PROD_DATABASE_URL if set
//   DRY_RUN=true|false              -> default: true
//   INCLUDE_VIP=true|false          -> default: true
//   MIN_ANSWERS=2                   -> default: 2
//   LIMIT=100                       -> default: 100
//   OFFSET=0                        -> default: 0
//   OPENAI_API_KEY=...              -> required if DRY_RUN=false
//   INTORI_OPENAI_MODEL=...         -> default: "gpt-4o-mini"
//
// Run (dry):
//   DRY_RUN=true LIMIT=20 OFFSET=0 npx tsx -r dotenv/config scripts/backfillSummaries.ts
//
// Run (write to DB):
//   DRY_RUN=false USE_PROD_DB=true LIMIT=20 OFFSET=0 npx tsx -r dotenv/config scripts/backfillSummaries.ts

import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

// ------------ Config helpers ------------
const bool = (v: any, def: boolean) =>
  typeof v === "string" ? v.toLowerCase() === "true" : v ?? def;

const num = (v: any, def: number) => {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : def;
};

// Decide which DB to use **before** we create PrismaClient
const useProd = bool(process.env.USE_PROD_DB, false);
if (useProd && process.env.PROD_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.PROD_DATABASE_URL!;
}

const DRY_RUN = bool(process.env.DRY_RUN, true);
const INCLUDE_VIP = bool(process.env.INCLUDE_VIP, true);
const MIN_ANSWERS = num(process.env.MIN_ANSWERS, 2);
const LIMIT = num(process.env.LIMIT, 100);
const OFFSET = num(process.env.OFFSET, 0);
const MODEL = process.env.INTORI_OPENAI_MODEL || "gpt-4o-mini";

const SOURCE = "icebreakers_v1";

const prisma = new PrismaClient();

// ------------ Prompt builder (same shape as lib/ai/prompt.ts) ------------
type VIPInsight = { answerId: string; answer: string; rating: number; question?: string };

function buildIcebreakerSummaryPrompt(
  icebreakers: Record<string, unknown>,
  vipInsights: VIPInsight[] = []
): string {
  const lines: string[] = [];

  lines.push(
    "You are writing a short, friendly profile intro for a social app.",
    "Write 1–2 sentences (max ~120 words total), conversational, positive, and specific.",
    "Avoid repeating the exact question text; synthesize a vibe. No emojis. No hashtags."
  );

  // Icebreakers block (key-value)
  try {
    const entries = Object.entries(icebreakers || {});
    if (entries.length > 0) {
      lines.push("", "Icebreakers (key: value):");
      for (const [k, v] of entries) {
        const val =
          typeof v === "string" || typeof v === "number" || typeof v === "boolean"
            ? String(v)
            : Array.isArray(v)
            ? (v as any[]).join(", ")
            : JSON.stringify(v);
        lines.push(`- ${k}: ${val}`);
      }
    }
  } catch {
    // ignore
  }

  // VIP insights (rating 3 only)
  const vipTop = (vipInsights || []).filter((i) => i.rating === 3);
  if (vipTop.length > 0) {
    lines.push("", "Very important insights (user-rated):");
    for (const i of vipTop) lines.push(`- ${i.answer}`);
  }

  lines.push("", "Return only the final paragraph—no preamble, no bullet points, no labels.");
  return lines.join("\n");
}

// ------------ Data fetchers ------------
async function fetchCandidateFids(minAnswers: number, limit: number, offset: number): Promise<number[]> {
  // Use SQL for efficiency
  const rows: Array<{ fid: number }> = await prisma.$queryRawUnsafe(
    `SELECT "fid"
     FROM "UserAnswer"
     GROUP BY "fid"
     HAVING COUNT(*) >= $1
     ORDER BY "fid"
     LIMIT $2 OFFSET $3`,
    minAnswers,
    limit,
    offset
  );
  return rows.map((r) => Number(r.fid));
}

async function fetchIcebreakers(fid: number): Promise<Record<string, unknown>> {
  // Take the most recent ~25 answers and build a simple key:value map
  const answers = await prisma.userAnswer.findMany({
    where: { fid },
    orderBy: { createdAt: "desc" },
    take: 25,
    select: { question: true, answer: true },
  });

  const map: Record<string, unknown> = {};
  for (const a of answers) {
    const key = (a.question || "Q").slice(0, 80);
    map[key] = a.answer;
  }
  return map;
}

async function fetchVipInsights(fid: number): Promise<VIPInsight[]> {
  if (!INCLUDE_VIP) return [];
  const ratings = await prisma.insightRating.findMany({
    where: { fid, rating: 3 },
    select: { answerId: true, rating: true },
    orderBy: { answerId: "asc" },
    take: 30,
  });

  if (ratings.length === 0) return [];

  const answers = await prisma.userAnswer.findMany({
    where: { id: { in: ratings.map((r) => r.answerId) } },
    select: { id: true, question: true, answer: true },
  });

  const answerById = new Map(answers.map((a) => [a.id, a]));
  return ratings
    .map((r) => {
      const a = answerById.get(r.answerId);
      if (!a) return null;
      return { answerId: r.answerId, answer: a.answer, question: a.question ?? undefined, rating: r.rating };
    })
    .filter(Boolean) as VIPInsight[];
}

// ------------ OpenAI summary ------------
async function generateSummary(icebreakers: Record<string, unknown>, vip: VIPInsight[]): Promise<string> {
  const prompt = buildIcebreakerSummaryPrompt(icebreakers, vip);

  if (DRY_RUN) {
    // Return a deterministic placeholder
    return "Curious, community-minded, and into meaningful conversations—brings good energy and clear interests.";
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY missing (required when DRY_RUN=false).");

  const client = new OpenAI({ apiKey: key });
  const resp = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: "You write concise, friendly profile intros." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 140,
  });

  const summary =
    resp.choices?.[0]?.message?.content?.trim() ||
    "Curious, community-minded, and into meaningful conversations—brings good energy and clear interests.";
  return summary;
}

// ------------ Main ------------
async function processFid(fid: number): Promise<{ fid: number; saved: boolean }> {
  // sanity: ensure UserProfile exists (FK for UserSummary.userFid)
  const prof = await prisma.userProfile.findUnique({ where: { fid } });
  if (!prof) {
    // create a minimal placeholder if missing
    await prisma.userProfile.create({
      data: {
        fid,
        username: `user_${fid}`,
        bio: "",
        power_badge: false,
      },
    });
  }

  const ice = await fetchIcebreakers(fid);
  const vip = await fetchVipInsights(fid);
  const summary = await generateSummary(ice, vip);

  if (DRY_RUN) {
    return { fid, saved: false };
  }

  await prisma.userSummary.upsert({
    where: { userFid: fid },
    create: { userFid: fid, summaryText: summary, source: SOURCE },
    update: { summaryText: summary, source: SOURCE, generatedAt: new Date() },
  });

  return { fid, saved: true };
}

async function main() {
  console.log("---- Backfill User Summaries ----");
  console.log(`Target DB: ${useProd ? "PRODUCTION" : "STAGING/DEV"}`);
  console.log(`Dry run: ${DRY_RUN}`);
  console.log(`Include VIP: ${INCLUDE_VIP}`);
  console.log(`minAnswers: ${MIN_ANSWERS} limit: ${LIMIT} offset: ${OFFSET}`);

  const fids = await fetchCandidateFids(MIN_ANSWERS, LIMIT, OFFSET);
  console.log(`Candidates: ${fids.length}`);

  let done = 0;
  for (const fid of fids) {
    try {
      const r = await processFid(fid);
      done++;
      if (done % 20 === 0 || done === fids.length) {
        console.log(`Processed ${done}/${fids.length} (last fid=${fid}, saved=${r.saved})`);
      }
    } catch (e: any) {
      console.error(`FID ${fid} error:`, e?.message || e);
    }
  }

  console.log("---- Done ----");
}

main()
  .catch((e) => {
    console.error("Backfill error:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
