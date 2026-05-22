"use client";
import { BrainCircuit } from "lucide-react";
import { useState } from "react";
import { useModel , ModelLabel } from "@/app/context/ModelContext ";

export default function ModelSelector() {


  const models = [
    { id: "qwen", label : "Qwen" },
    { id: "mistral", label: "Mistral24B"},  { id: "gpt", label: "GPT"},

  ]

  const {selected, setSelected} = useModel();
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
        <select
          className="
    w-full rounded-xl border border-slate-700 bg-slate-900
    px-4 py-3 text-sm text-white
    focus:outline-none focus:ring-2 focus:ring-cyan-400  
  "  onChange={(e)=>(setSelected(e.target.value as ModelLabel) )}
  value={selected}
  
        >
          {
            models.map((item ,_)=>{
              return(
             <option value={item.id}>{item.label}</option>
          
              )
            })
          }
         
        </select>
      </div>
       <p className="mt-2 text-xs text-slate-400">You selected {models[models.findIndex((d)=> d.id === selected)]?.label} Model to KG Extraction task.</p>
    </div>
  );
}