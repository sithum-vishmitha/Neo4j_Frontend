"use client";

import { BrainCircuit } from "lucide-react";

export default function ModelSelector() {
  return (
    <div
      className="
        rounded-3xl border border-white/10
        bg-gradient-to-b from-[#121B28] to-[#0F1722]
        p-6
        shadow-[0_0_35px_rgba(0,0,0,0.35)]
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white">
            Model Selection
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Choose an LLM for knowledge graph extraction
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
          <BrainCircuit size={20} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          className="
            rounded-2xl border border-cyan-400/20
            bg-cyan-400/10 px-4 py-4
            text-left transition-all duration-300
            hover:border-cyan-400/40 hover:bg-cyan-400/15
          "
        >
          <p className="text-sm font-semibold text-white">Qwen</p>
          <p className="mt-1 text-xs text-slate-400">
          </p>
        </button>

        <button
          type="button"
          className="
            rounded-2xl border border-violet-400/20
            bg-violet-400/10 px-4 py-4
            text-left transition-all duration-300
            hover:border-violet-400/40 hover:bg-violet-400/15
          "
        >
          <p className="text-sm font-semibold text-white">Mistral24B</p>
          <p className="mt-1 text-xs text-slate-400">
          </p>
        </button>
      </div>
    </div>
  );
}