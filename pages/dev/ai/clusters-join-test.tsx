// pages/dev/ai/clusters-join-test.tsx
import { useEffect, useState } from "react";

type ClusterRow = {
  id: string;
  slug: string;
  label: string;
  emoji?: string | null;
  priority: number;
  autoJoin: boolean;
  joined?: boolean;
};

type EligibleRow = {
  id: string;
  slug: string;
  label: string;
  emoji?: string | null;
  priority: number;
  autoJoin: boolean;
  joined: boolean;
  eligible: boolean;
  signalsMatched: number;
  signalsRequired: number;
  boostCount: number;
  debug?: string[];
};

export default function ClustersJoinTest() {
  const [fid, setFid] = useState<number>(1234);

  const [clusters, setClusters] = useState<ClusterRow[]>([]);
  const [eligibility, setEligibility] = useState<EligibleRow[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Load current joined/not-joined list (no eligibility)
  const loadClusters = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/clusters/for-user?fid=${fid}`);
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Failed to load clusters");
      setClusters((j.clusters ?? []) as ClusterRow[]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Load read-only eligibility view
  const checkEligibility = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/clusters/eligibility?fid=${fid}`);
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Failed to check eligibility");
      setEligibility((j.clusters ?? []) as EligibleRow[]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Dev-only auto-join (GET allowed if NEXT_PUBLIC_INTORI_DEV_PAGES === "true")
  const autoJoinEligible = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/clusters/auto-join?fid=${fid}`);
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Auto-join failed");
      // Refresh both views so UI reflects changes
      await Promise.all([loadClusters(), checkEligibility()]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const join = async (clusterId: string) => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/clusters/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fid, clusterId }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Join failed");
      await Promise.all([loadClusters(), checkEligibility()]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const leave = async (clusterId: string) => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/clusters/leave", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fid, clusterId }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Leave failed");
      await Promise.all([loadClusters(), checkEligibility()]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load: basic clusters + eligibility
    (async () => {
      await loadClusters();
      await checkEligibility();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Small helpers
  const eligMap = new Map( (eligibility ?? []).map(e => [e.id, e]) );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-2xl font-semibold mb-4">Clusters — Join / Leave / Eligibility</h1>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium">Test FID</label>
          <input
            type="number"
            className="border rounded-md px-3 py-2 w-40"
            value={fid}
            onChange={(e) => setFid(parseInt(e.target.value || "0", 10))}
          />
          <button
            onClick={loadClusters}
            disabled={loading}
            className="rounded-md px-4 py-2 bg-black text-white disabled:opacity-50"
          >
            Refresh (Joined View)
          </button>
          <button
            onClick={checkEligibility}
            disabled={loading}
            className="rounded-md px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Check Eligibility
          </button>
          <button
            onClick={autoJoinEligible}
            disabled={loading}
            className="rounded-md px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            title="Dev-only GET route must be enabled"
          >
            Auto-Join Eligible
          </button>
        </div>

        {err && <div className="mb-4 text-red-600">Error: {err}</div>}
        {loading && <div className="mb-4 text-gray-600">Working…</div>}

        <div className="mb-2 text-sm text-gray-600">
          Showing current cluster list (joined/not) with eligibility badges (if loaded).
        </div>

        <div className="grid gap-3">
          {clusters.map((c) => {
            const e = eligMap.get(c.id);
            const eligible = e?.eligible ?? false;
            const signals = e ? `${e.signalsMatched}/${e.signalsRequired}` : null;

            return (
              <div key={c.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium">
                    {c.emoji ? <span className="mr-2">{c.emoji}</span> : null}
                    {c.label}
                  </div>
                  <div className="text-xs text-gray-500">slug: {c.slug}</div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {c.joined ? (
                      <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Joined
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-700 border">
                        Not Joined
                      </span>
                    )}
                    {e && (
                      <>
                        <span className={`text-xs px-2 py-1 rounded border ${eligible ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                          {eligible ? "Eligible" : "Not Eligible"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-slate-50 text-slate-700 border">
                          Signals: {signals}
                        </span>
                        {typeof e.boostCount === "number" && (
                          <span className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Boosts: {e.boostCount}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {c.joined ? (
                    <button
                      onClick={() => leave(c.id)}
                      className="rounded-md px-3 py-2 border border-gray-300 hover:bg-gray-100"
                      disabled={loading}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => join(c.id)}
                      className="rounded-md px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {clusters.length === 0 && !loading && (
          <div className="text-gray-500">No clusters yet. Did you seed the DB?</div>
        )}
      </div>
    </div>
  );
}
