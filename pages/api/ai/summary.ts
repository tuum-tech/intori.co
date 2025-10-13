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
  saved: boolean;
};

type Err = {
  ok: false;
  error: string;
  details?: string;
};

const MODEL = process.env.INTORI_OPENAI_MODEL || "gpt-4o-mini";
const SOURCE = "icebreakers_v1";

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

    await prisma.userSummary.upsert({
      where: { userFid: fidNum },
      create: { userFid: fidNum, summaryText: summary, source: SOURCE },
      update: { summaryText: summary, source: SOURCE, generatedAt: new Date() },
    });

    return res
      .status(200)
      .json({ ok: true, fid: fidNum, summary, source: SOURCE, saved: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("summary route error:", e);
    return res
      .status(500)
      .json({ ok: false, error: "Internal error", details: msg });
  }
}
