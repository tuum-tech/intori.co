import { useEffect, useMemo, useState } from "react";

type FetchResp =
  | { ok: true; fid: number; found: true; summary: string; source: string; generatedAt: string }
  | { ok: true; fid: number; found: false }
  | { ok: false; error: string };

type PostResp =
  | { ok: true; fid: number; summary: string; source: string; saved: boolean }
  | { ok: false; error: string; details?: string };

const DEFAULT_ICEBREAKERS = {
  Personality: "Ambivert",
  Coffee_or_Tea: "Iced tea",
  Weekend_Vibe: "Lounging",
  TV_or_Movies: "Watch TV",
  Social_Media: "Farcaster",
  Friends_Time_Per_Week: "11-15",
  Favorite_Drama: "Drama",
  Food: "Pizza",
  Vacation: "Tropical island",
  Region: "North America",
  Music: "EDM",
  Work_Style: "Strategist",
  Night_Out: "Sports Game",
  Life_Phase: "In Between",
  Rainy_Day: "Depends on the Weather",
  Mindset: "Stay in the Present",
  Work_Setup: "Hybrid",
};

export default function SummaryTest() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [fid, setFid] = useState<number>(1234);
  const [dryRun, setDryRun] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const [icebreakersText, setIcebreakersText] = useState<string>(
    JSON.stringify(DEFAULT_ICEBREAKERS, null, 2)
  );

  const [postResult, setPostResult] = useState<PostResp | null>(null);
  const [getResult, setGetResult] = useState<FetchResp | null>(null);

  // Only allow in dev or when guard flag is on
  useEffect(() => {
    setEnabled(process.env.NEXT_PUBLIC_INTORI_DEV_PAGES === "true");
  }, []);

  const icebreakersObject = useMemo(() => {
    try {
      return JSON.parse(icebreakersText);
    } catch {
      return null;
    }
  }, [icebreakersText]);

  const generate = async () => {
    setBusy(true);
    setErr(null);
    setPostResult(null);
    try {
      if (!icebreakersObject || typeof icebreakersObject !== "object") {
        throw new Error("Icebreakers must be valid JSON (an object).");
      }
      const r = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fid,
          icebreakers: icebreakersObject,
          dryRun,
        }),
      });
      const j = (await r.json()) as PostResp;
      if (!j.ok) throw new Error(j.error);
      setPostResult(j);
    } catch (e: any) {
      setErr(e.message || "Failed to generate");
    } finally {
      setBusy(false);
    }
  };

  const fetchExisting = async () => {
    setBusy(true);
    setErr(null);
    setGetResult(null);
    try {
      const r = await fetch(`/api/ai/summary/${fid}`);
      const j = (await r.json()) as FetchResp;
      if (!("ok" in j) || (j as any).ok !== true) throw new Error("Bad response");
      setGetResult(j);
    } catch (e: any) {
      setErr(e.message || "Failed to fetch");
    } finally {
      setBusy(false);
    }
  };

  if (!enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-2xl font-semibold mb-2">Dev page disabled</h1>
          <p className="text-gray-600">
            Set <code className="px-1 py-0.5 bg-gray-100 rounded">NEXT_PUBLIC_INTORI_DEV_PAGES=true</code> (and
            <code className="px-1 py-0.5 bg-gray-100 rounded ml-1">INTORI_DEV_PAGES=true</code> on the server) to
            enable this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">AI Summary — Dev Tester</h1>
          <p className="text-gray-600">
            Generate a 2-sentence profile summary from your Ice Breakers, save it, and fetch it back for verification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="bg-white rounded-xl border p-4 md:col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">FID</label>
              <input
                type="number"
                value={fid}
                onChange={(e) => setFid(parseInt(e.target.value || "0", 10))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                />
                <span className="text-sm">Dry run (don’t save)</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generate}
                disabled={busy || !icebreakersObject}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
              >
                {busy ? "Working…" : "Generate Summary"}
              </button>
              <button
                onClick={fetchExisting}
                disabled={busy}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Fetch Existing
              </button>
            </div>

            {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
          </div>

          {/* Icebreakers editor */}
          <div className="bg-white rounded-xl border p-4 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Ice Breakers (JSON)</label>
              <button
                className="text-xs underline text-gray-600"
                onClick={() => setIcebreakersText(JSON.stringify(DEFAULT_ICEBREAKERS, null, 2))}
              >
                Reset example
              </button>
            </div>
            <textarea
              className="w-full h-64 border rounded-lg px-3 py-2 font-mono text-sm"
              value={icebreakersText}
              onChange={(e) => setIcebreakersText(e.target.value)}
            />
            {!icebreakersObject && (
              <div className="mt-2 text-xs text-red-600">Invalid JSON</div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-4">
            <h2 className="text-sm font-semibold mb-2">Generate (POST /api/ai/summary)</h2>
            <pre className="text-xs bg-gray-50 rounded-lg p-3 overflow-auto">
{JSON.stringify(postResult, null, 2)}
            </pre>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <h2 className="text-sm font-semibold mb-2">Fetch (GET /api/ai/summary/[fid])</h2>
            <pre className="text-xs bg-gray-50 rounded-lg p-3 overflow-auto">
{JSON.stringify(getResult, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
