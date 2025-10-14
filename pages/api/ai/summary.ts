// pages/api/ai/summary.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { buildIcebreakerSummaryPrompt } from "@/lib/ai/prompt";

type Ok = {
  ok: true;
  fid: number;
  summary: string;
  source: string; // e.g., "icebreakers_v1"
  saved: boolean; // false when table isn't available yet
};

type Err = {
  ok: false;
  error: string;
  details?: string;
};

const MODEL = process.env.INTORI_OPENAI_MODEL || "gpt-4o-mini";
const SOURCE = "icebreakers_v1";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function getPrismaCode(err: unknown): string | undefined {
  if (err && typeof err === "object" && "code" in err) {
    const c = (err as { code?: unknown }).code;
    if (typeof c === "string") return c;
  }
  if (err && typeof err === "object" && "meta" in err) {
    const meta = (err as { meta?: unknown }).meta;
    if (meta && typeof meta === "object" && "code" in meta) {
      const mc = (meta as { code?: unknown }).code;
      if (typeof mc === "string") return mc;
    }
  }
  return undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return res.status(500).json({ ok: false, error: "OPENAI_API_KEY missing" });
  }

  const { fid, icebreakers, dryRun } = (req.body ?? {}) as {
    fid?: number | string;
    icebreakers?: Record<string, unknown>;
    dryRun?: boolean;
  };

  const fidNum = parseInt(String(fid ?? ""), 10);
  if (!fidNum || Number.isNaN(fidNum)) {
    return res.status(400).json({ ok: false, error: "Missing or invalid fid" });
  }

  if (!icebreakers || typeof icebreakers !== "object") {
    return res
      .status(400)
      .json({ ok: false, error: "Provide `icebreakers` object in body" });
  }

  try {
    const client = new OpenAI({ apiKey: openaiKey });
    const prompt = buildIcebreakerSummaryPrompt(icebreakers);

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
      "This person has a friendly, balanced vibe and a variety of interests.";

    if (dryRun) {
      return res
        .status(200)
        .json({ ok: true, fid: fidNum, summary, source: SOURCE, saved: false });
    }

    // Try to persist; if the table isn't present yet, return saved:false.
    try {
      await prisma.userSummary.upsert({
        where: { userFid: fidNum },
        create: { userFid: fidNum, summaryText: summary, source: SOURCE },
        update: { summaryText: summary, source: SOURCE, generatedAt: new Date() },
      });

      return res
        .status(200)
        .json({ ok: true, fid: fidNum, summary, source: SOURCE, saved: true });
    } catch (persistErr: unknown) {
      const msg = getErrorMessage(persistErr);
      const code = getPrismaCode(persistErr);
      const missingTable =
        code === "P2021" ||
        /does not exist/i.test(msg) ||
        /relation .*usersummary.* does not exist/i.test(msg) ||
        /Table .*UserSummary.* does not exist/i.test(msg);

      if (missingTable) {
        return res.status(200).json({
          ok: true,
          fid: fidNum,
          summary,
          source: SOURCE,
          saved: false,
        });
      }
      console.error("summary persist error:", persistErr);
      return res.status(500).json({ ok: false, error: "Internal error", details: msg });
    }
  } catch (e: unknown) {
    const msg = getErrorMessage(e);
    console.error("summary route error:", e);
    return res.status(500).json({ ok: false, error: "Internal error", details: msg });
  }
}
