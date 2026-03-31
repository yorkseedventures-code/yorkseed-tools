"use client";

import { useState } from "react";

export default function Page() {
  const [idea, setIdea] = useState("");
  const [customer, setCustomer] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!idea.trim() || !customer.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/one-liner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, customer, problem }),
      });

      const data = await res.json();
      setResults(data.lines || []);
    } catch {
      setResults(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f7f5f1] px-6 py-10 text-[#161616]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">
            Yorkseed One-Liner Pitch Generator
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            A simple free tool for Yorkseed members to generate a sharper startup one-liner.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  What are you building?
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  placeholder="Example: AI software that helps legal teams review contracts faster"
                  className="w-full rounded-2xl border border-black/10 bg-[#fcfbf8] px-4 py-3 text-sm outline-none placeholder:text-black/35"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Who is it for?
                </label>
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Example: In-house legal teams and small law firms"
                  className="w-full rounded-2xl border border-black/10 bg-[#fcfbf8] px-4 py-3 text-sm outline-none placeholder:text-black/35"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  What problem are you solving? <span className="text-black/40">Optional</span>
                </label>
                <input
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Example: Contract review is too slow and manual"
                  className="w-full rounded-2xl border border-black/10 bg-[#fcfbf8] px-4 py-3 text-sm outline-none placeholder:text-black/35"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !idea.trim() || !customer.trim()}
                className="w-full rounded-2xl bg-black px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate One-Liners"}
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Your results</h2>
              <p className="mt-2 text-sm text-black/60">
                You will get three cleaner, investor-friendly options.
              </p>
            </div>

            <div className="space-y-3">
              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-[#fcfbf8] p-4 text-sm text-black/45">
                  Your generated one-liners will appear here.
                </div>
              ) : (
                results.map((line, index) => (
                  <div key={index} className="rounded-2xl border border-black/8 bg-[#fcfbf8] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                        Option {index + 1}
                      </div>
                      <button
                        onClick={() => handleCopy(line, index)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-black/65"
                      >
                        {copiedIndex === index ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-sm leading-6 text-black/80">{line}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
