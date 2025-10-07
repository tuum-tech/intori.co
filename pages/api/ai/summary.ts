// pages/api/ai/summary.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

type Data =
  | { ok: true; fid: number; summary: string; source: string }
  | { ok: false; error: string };

const SUMMARY_SOURCE = "icebreakers_v1";

function buildPrompt(icebreakers: Record<string, string>) {
  // Flatten key/value to a human-readable list:
  const pairs = Object.entries(icebreakers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  // Tone: your “Option C”: warm, concise, conversational.
  return `
You are summarizing a new user based only on their answers to 20 short Ice Breaker questions.
Write a 2-sentence intro for their profile: positive, concise, natural—as if a friend introducing them.
Do not list answers; synthesize them. Include one conversation spark. Avoid fluff.

Icebreaker answers:
${pairs}

Write exactly 2 sentences.`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { fid, icebreakers } = req.body || {};
    const fidNum = parseInt(String(fid ?? ""), 10);
    if (!fidNum || Number.isNaN(fidNum)) {
      return res.status(400).json({ ok: false, error: "Bad request: missing or invalid fid" });
    }
    if (!icebreakers || typeof icebreakers !== "object") {
      return res.status(400).json({ ok: false, error: "Bad request: missing icebreakers object" });
    }

    // Ensure user exists
    const user = await prisma.userProfile.findUnique({ where: { fid: fidNum } });
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });

    // OpenAI client (env must be set locally & in Vercel preview for your branch)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ ok: false, error: "OPENAI_API_KEY not configured" });

    const openai = new OpenAI({ apiKey });

    const prompt = buildPrompt(icebreakers);

    // Use a small, fast model. Adjust to your contract if you prefer.
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 120,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Curious, thoughtful, and open to conversation.";

    // Persist (upsert)
    const saved = await prisma.userSummary.upsert({
      where: { userFid: fidNum },
      create: { userFid: fidNum, summaryText: text, source: SUMMARY_SOURCE },
      update: { summaryText: text, source: SUMMARY_SOURCE, generatedAt: new Date() },
    });

    return res.status(200).json({ ok: true, fid: fidNum, summary: saved.summaryText, source: saved.source });
  } catch (err: any) {
    console.error("summary error:", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
