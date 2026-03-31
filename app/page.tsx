"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export default function Page() {
  const [activeTool, setActiveTool] = useState<"pitch" | "runway" | "dilution" | "burn">("pitch");

  const [idea, setIdea] = useState("");
  const [customer, setCustomer] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const [cashOnHand, setCashOnHand] = useState("");
  const [monthlyBurn, setMonthlyBurn] = useState("");
  const [targetRunway, setTargetRunway] = useState("18");

  const [raiseAmount, setRaiseAmount] = useState("");
  const [valuation, setValuation] = useState("");

  const [netNewARR, setNetNewARR] = useState("");

  const [toast, setToast] = useState("");

  const handleGenerate = async () => {
    if (results.length > 0) {
      setToast("Free limit reached");
      setTimeout(() => setToast(""), 1500);
      return;
    }
    if (!idea.trim() || !customer.trim()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const cleanIdea = idea.trim();
      const cleanCustomer = customer.trim();
      const cleanProblem = problem.trim();

      setResults([
        `We help ${cleanCustomer} solve ${cleanProblem || "their workflow bottlenecks"} with ${cleanIdea}.`,
        `${cleanIdea} is built for ${cleanCustomer} who need a faster, simpler way to work.`,
        `A smarter solution for ${cleanCustomer} looking to improve ${cleanProblem || "how work gets done"}.`,
      ]);
    } catch {
      setResults(["Demo mode error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (typeof index === "number") setCopiedIndex(index);
      setToast("Copied");
      setTimeout(() => {
        setCopiedIndex(null);
        setToast("");
      }, 1200);
    } catch {}
  };

  const copyAll = () => {
    handleCopy(results.join("\n"));
  };

  const handleClearPitch = () => {
    setIdea("");
    setCustomer("");
    setProblem("");
    setResults([]);
    setCopiedIndex(null);
  };

  const formatMoney = (value: number) => {
    if (!Number.isFinite(value)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cash = Number(cashOnHand) || 0;
  const burn = Number(monthlyBurn) || 0;
  const target = Number(targetRunway) || 0;
  const raise = Number(raiseAmount) || 0;
  const companyValuation = Number(valuation) || 0;
  const newARR = Number(netNewARR) || 0;

  const currentRunway = burn > 0 ? cash / burn : 0;
  const targetRaise = burn > 0 && target > 0 ? Math.max(target * burn - cash, 0) : 0;
  const twelveMonthRaise = burn > 0 ? Math.max(12 * burn - cash, 0) : 0;

  const dilution = companyValuation > 0 ? (raise / companyValuation) * 100 : 0;
  const postMoney = companyValuation + raise;

  const burnMultiple = newARR > 0 ? burn / newARR : 0;
  const burnScore = burnMultiple === 0 ? 0 : Math.max(0, Math.min(100, Math.round((2 - burnMultiple) * 50)));

  return (
    <div className="min-h-screen bg-[#f7f5f1] px-6 py-10 text-[#161616]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">Yorkseed Intelligence Suite</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Signal over noise. Shareable founder tools.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTool("pitch")}
              className={`rounded-2xl px-4 py-2.5 text-sm ${activeTool === "pitch" ? "bg-black text-white" : "border border-black/10 bg-white text-black/70"}`}
            >
              Signal One-Liner
            </button>
            <button
              onClick={() => setActiveTool("runway")}
              className={`rounded-2xl px-4 py-2.5 text-sm ${activeTool === "runway" ? "bg-black text-white" : "border border-black/10 bg-white text-black/70"}`}
            >
              Capital Runway
            </button>
            <button
              onClick={() => setActiveTool("dilution")}
              className={`rounded-2xl px-4 py-2.5 text-sm ${activeTool === "dilution" ? "bg-black text-white" : "border border-black/10 bg-white text-black/70"}`}
            >
              Equity Dilution
            </button>
            <button
              onClick={() => setActiveTool("burn")}
              className={`rounded-2xl px-4 py-2.5 text-sm ${activeTool === "burn" ? "bg-black text-white" : "border border-black/10 bg-white text-black/70"}`}
            >
              Burn Multiple
            </button>
          </div>
        </div>

        {activeTool === "pitch" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="What are you building"
                  className="w-full rounded-2xl border border-black/10 p-3"
                  rows={4}
                />
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Who is it for"
                  className="w-full rounded-2xl border border-black/10 p-3"
                />
                <input
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Problem (optional)"
                  className="w-full rounded-2xl border border-black/10 p-3"
                />

                <div className="flex gap-3">
                  <button onClick={handleGenerate} className="w-full rounded-2xl bg-black p-3 text-white">
                    {loading ? "Generating..." : "Generate Signal"}
                  </button>
                  <button onClick={handleClearPitch} className="rounded-2xl border border-black/10 px-5 py-3 text-sm">
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Pitch Options</h2>
                {results.length > 0 && (
                  <button onClick={copyAll} className="rounded border border-black/10 px-2 py-1 text-xs">
                    Copy All
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {results.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black/10 p-4 text-sm text-black/45">
                    Your generated one-liners will appear here.
                  </div>
                ) : (
                  results.map((r, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 rounded-2xl border border-black/10 p-3">
                      <span className="text-sm leading-6">{r}</span>
                      <button onClick={() => handleCopy(r, i)}>
                        {copiedIndex === i ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTool === "runway" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm space-y-3">
              <input
                value={cashOnHand}
                onChange={(e) => setCashOnHand(e.target.value)}
                placeholder="Cash on hand"
                className="w-full rounded-2xl border border-black/10 p-3"
              />
              <input
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(e.target.value)}
                placeholder="Monthly burn"
                className="w-full rounded-2xl border border-black/10 p-3"
              />
              <input
                value={targetRunway}
                onChange={(e) => setTargetRunway(e.target.value)}
                placeholder="Target runway (months)"
                className="w-full rounded-2xl border border-black/10 p-3"
              />
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-black/40">Current runway</div>
                <div className="mt-1 text-3xl font-semibold">{burn > 0 ? `${currentRunway.toFixed(1)} months` : "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-black/40">Target raise needed</div>
                <div className="mt-1 text-2xl font-semibold">{target > 0 ? formatMoney(targetRaise) : "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-black/40">12-month reference</div>
                <div className="mt-1 text-2xl font-semibold">{formatMoney(twelveMonthRaise)}</div>
              </div>
            </div>
          </div>
        )}

        {activeTool === "dilution" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm space-y-3">
              <input
                value={raiseAmount}
                onChange={(e) => setRaiseAmount(e.target.value)}
                placeholder="Raise amount"
                className="w-full rounded-2xl border border-black/10 p-3"
              />
              <input
                value={valuation}
                onChange={(e) => setValuation(e.target.value)}
                placeholder="Company valuation"
                className="w-full rounded-2xl border border-black/10 p-3"
              />
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-black/40">Estimated dilution</div>
                <div className="mt-1 text-3xl font-semibold">{dilution > 0 ? `${dilution.toFixed(1)}%` : "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-black/40">Post-money value</div>
                <div className="mt-1 text-2xl font-semibold">{postMoney > 0 ? formatMoney(postMoney) : "—"}</div>
              </div>
            </div>
          </div>
        )}

        {activeTool === "burn" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm space-y-3">
              <input
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(e.target.value)}
                placeholder="Monthly burn"
                className="w-full rounded-2xl border border-black/10 p-3"
              />
              <input
                value={netNewARR}
                onChange={(e) => setNetNewARR(e.target.value)}
                placeholder="New ARR / month"
                className="w-full rounded-2xl border border-black/10 p-3"
              />
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
              <div className="text-3xl font-semibold">{burnMultiple ? burnMultiple.toFixed(2) : "—"}</div>
              <div className="mt-3 h-2 rounded bg-gray-200">
                <div className="h-2 rounded bg-black" style={{ width: `${burnScore}%` }}></div>
              </div>
              <p className="mt-2 text-sm text-black/60">Lower is better. &lt;1 strong, 1–2 okay, &gt;2 inefficient.</p>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded bg-black px-4 py-2 text-white">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
