import { useEffect, useMemo, useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { AppLayout } from "@/layouts/App";
import { Section } from "@/components/common/Section";

type EligibilityItem = {
  id: string;
  label: string;
  priority: number;
  eligible: boolean;
  qualifying: number;
  score: number;
};
type ApiResp =
  | { ok: true; results: EligibilityItem[] }
  | { ok: false; error: string };

type Props = { devEnabled: boolean };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // Server decides if this page is visible
  const devEnabled =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_INTORI_DEV_PAGES === "true";

  if (!devEnabled) {
    // Hide this page when the flag is off
    return { notFound: true };
    // Or redirect:
    // return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { devEnabled } };
};

const DEFAULT_PAYLOAD = {
  icebreakers: {
    q01_introvert_ambivert_extrovert: "Ambivert",
    q16_concert_or_sports: "Sports Game",
  },
  insights: [],
};
const STORAGE_KEY = "intori.dev.clusterPayload.v1";

const DevClustersCheck: NextPage<Props> = () => {
  const [payloadText, setPayloadText] = useState("");
  const [results, setResults] = useState<EligibilityItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [onlyEligible, setOnlyEligible] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setPayloadText(saved ?? JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  }, []);

  useEffect(() => {
    if (payloadText) localStorage.setItem(STORAGE_KEY, payloadText);
  }, [payloadText]);

  const runTest = async () => {
    setLoading(true);
    setErr(null);
    setResults(null);
    let body: any;
    try {
      body = JSON.parse(payloadText);
    } catch (e: any) {
      setLoading(false);
      setErr(`Invalid JSON: ${e?.message || "Parse error"}`);
      return;
    }
    try {
      const res = await fetch("/api/ai/eligibility", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json: ApiResp = await res.json();
      if (!res.ok || !json.ok) throw new Error((json as any)?.error || `HTTP ${res.status}`);
      setResults(json.results);
    } catch (e: any) {
      setErr(e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!payloadText) return;
    const t = setTimeout(runTest, 150);
    return () => clearTimeout(t);
  }, [payloadText]);

  const { eligible, others } = useMemo(() => {
    const list = (results || []).slice().sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      if (b.priority !== a.priority) return b.priority - a.priority;
      return b.score - a.score;
    });
    const filter = (r: EligibilityItem) => {
      if (onlyEligible && !r.eligible) return false;
      if (q && !r.label.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    };
    const filtered = list.filter(filter);
    return {
      eligible: filtered.filter((r) => r.eligible),
      others: filtered.filter((r) => !r.eligible),
    };
  }, [results, q, onlyEligible]);

  const eligibleCount = eligible.length;
  const totalCount = (results || []).length;

  return (
    <AppLayout>
      <Section title="DEV • Cluster Eligibility">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: editor */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Test Payload (JSON)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPayloadText(JSON.stringify(DEFAULT_PAYLOAD, null, 2))}
                    className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(payloadText)}
                    className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-50"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <textarea
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                spellCheck={false}
                className="h-64 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800 outline-none focus:border-indigo-400"
              />

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={runTest}
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Running…" : "Run test"}
                </button>

                {err && (
                  <span className="text-xs text-red-600" title={err}>
                    {err.length > 64 ? err.slice(0, 64) + "…" : err}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: results */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Eligible: {eligibleCount}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  Total: {totalCount}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search clusters…"
                  className="w-full min-w-[220px] rounded-xl border border-slate-300 px-3 py-2 text-sm sm:w-64"
                />
                <label className="inline-flex select-none items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyEligible}
                    onChange={(e) => setOnlyEligible(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Show only eligible
                </label>
              </div>
            </div>

            {eligible.length > 0 && (
              <>
                <h4 className="mb-2 text-sm font-semibold text-emerald-700">Eligible</h4>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {eligible.map((r) => (
                    <ResultCard key={r.id} item={r} />
                  ))}
                </div>
              </>
            )}

            <h4 className="mb-2 text-sm font-semibold text-slate-700">Others</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {others.map((r) => (
                <ResultCard key={r.id} item={r} />
              ))}
            </div>

            {!results && (
              <p className="mt-4 text-sm text-slate-500">
                No results yet — edit the payload or hit <strong>Run test</strong>.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          <strong>Heads up:</strong> Dev-only. Toggle with{" "}
          <code>NEXT_PUBLIC_INTORI_DEV_PAGES=true</code>.
        </div>
      </Section>
    </AppLayout>
  );
};

function ResultCard({ item }: { item: EligibilityItem }) {
  const badge = item.eligible
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-slate-900">{item.label}</h3>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge}`}>
          {item.eligible ? "Eligible" : "Not eligible"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-slate-100 px-2.5 py-1">qualifying: {item.qualifying}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1">score: {item.score}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1">priority: {item.priority}</span>
      </div>
    </div>
  );
}

export default DevClustersCheck;
