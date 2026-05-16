"use client";
import { useState } from "react";
import type { UploadedFile, PipelineStep } from "@/app/types";
import { UploadZone } from "@/app/components/pipeline/UploadZone";
import { PipelineFlow } from "@/app/components/pipeline/PipelineFlow";

import {
  Play,
  Loader2,
  Trash2,
  Activity,
  Database,
  FileText,
  Workflow,
  BrainCircuit,
  Network,
} from "lucide-react";
import { GraphStats } from "@/app/components/pipeline/GraphStats";
import { useGraph } from "@/app/context/GraphContext";

type Tab = "ingest" | "pipeline" | "stats";

interface LeftPanelProps {
  files: UploadedFile[];
  steps: PipelineStep[];
  running: boolean;
  onAddFiles: (f: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
  onClear: () => void;
  onRun: () => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "ingest", label: "Ingest" },
  { id: "pipeline", label: "Pipeline" },
  { id: "stats", label: "Graph Stats" },
];



function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: 'white',
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

export function LeftPanel({ files, steps, running, onAddFiles, onRemoveFile, onClear, onRun }: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("ingest");



  // Auto-switch to pipeline tab when running
  const handleRun = () => {
    setActiveTab("pipeline");
  
    onRun();
  };

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-[#0B1118] text-white">

      {/* Top Tabs */}
      <div className="flex border-b border-white/10 bg-[#0D141D] px-2 pt-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
              relative flex-1 rounded-t-xl px-4 py-3
              text-xs font-semibold tracking-[0.15em]
              transition-all duration-300
              ${active
                  ? "bg-[#111927] text-cyan-300 shadow-[0_-2px_20px_rgba(34,211,238,0.08)]"
                  : "text-white hover:text-slate-300"
                }
            `}
            >
              {active && (
                <div className="absolute inset-x-0 top-10 h-[2px] rounded-full bg-cyan-400" />
              )}

              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#0A1018]">

        {/* INGEST */}
        {activeTab === "ingest" && (
          <div className="space-y-6 p-6">

            {/* Upload Section */}
            <div
              className="
              rounded-3xl border border-white/10
              bg-gradient-to-b from-[#121B28] to-[#0F1722]
              p-6
              shadow-[0_0_35px_rgba(0,0,0,0.35)]
            "
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <SectionLabel>
                  Upload PDFs to Knowledge Graph
                </SectionLabel>

                <div
                  className="
                  rounded-full border border-cyan-400/20
                  bg-cyan-400/10 px-3 py-1
                  font-mono text-[10px]
                  tracking-[0.14em] text-cyan-300
                "
                >
                  DOCUMENT INGESTION
                </div>
              </div>

              <div className="mt-5">
                <UploadZone
                  files={files}
                  onAdd={onAddFiles}
                  onRemove={onRemoveFile}
                />
              </div>
            </div>

            {/* Pipeline Architecture */}
            <div
              className="
              overflow-hidden rounded-3xl border border-white/10
              bg-gradient-to-b from-[#121B28] to-[#0F1722]
              shadow-[0_0_35px_rgba(0,0,0,0.25)]
            "
            >
              {/* Top */}
              <div className="border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">

                  <SectionLabel>
                    Pipeline Architecture
                  </SectionLabel>

                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-300 animate-pulse" />

                    <span className="font-mono text-[10px] tracking-[0.12em] text-emerald-300">
                      ACTIVE PIPELINE
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">

                {/* Description */}
                <div
                  className="
                  rounded-2xl border border-cyan-400/10
                  bg-black/20 p-5
                  font-mono text-[11px]
                  leading-7 text-slate-300
                "
                >
                  The ingestion pipeline extracts entities, semantic relationships,
                  and graph structures from uploaded PDF documents. Extracted data
                  is transformed into Cypher-compatible graph records and exported
                  as

                  <span className="mx-1 font-semibold text-cyan-300">
                    neo4j_query_table_data.csv
                  </span>

                  for Neo4j ingestion and GraphXR visualization.
                </div>

                {/* Flow */}
                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-5">

                  {[
                    {
                      label: "PDF Upload",
                      icon: FileText,
                    },
                    {
                      label: "NLP Extraction",
                      icon: BrainCircuit,
                    },
                    {
                      label: "Entity Mapping",
                      icon: Workflow,
                    },
                    {
                      label: "Neo4j Build",
                      icon: Database,
                    },
                    {
                      label: "GraphXR Visualize",
                      icon: Network,
                    },
                  ].map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className="
                        relative flex flex-col items-center
                        rounded-2xl border border-white/10
                        bg-white/[0.03]
                        px-3 py-4 text-center
                        transition-all duration-300
                        hover:border-cyan-400/20
                        hover:bg-white/[0.05]
                        hover:-translate-y-0.5
                      "
                      >
                        <div
                          className="
                          mb-3 flex h-10 w-10 items-center justify-center
                          rounded-xl border border-cyan-400/20
                          bg-cyan-400/10
                        "
                        >
                          <Icon className="h-5 w-5 text-cyan-300" />
                        </div>

                        <div className="text-xs font-medium leading-5 text-white">
                          {step.label}
                        </div>

                        {index !== 4 && (
                          <div
                            className="
                            absolute -right-2 top-1/2 hidden
                            h-[2px] w-4 bg-cyan-400/30
                            lg:block
                          "
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="p-6">

            <div
              className="
              relative overflow-hidden rounded-3xl
              border border-white/10
              bg-gradient-to-b from-[#121B28] via-[#101824] to-[#0B1119]
              shadow-[0_0_45px_rgba(0,0,0,0.45)]
            "
            >
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_40%)]" />

              {/* Header */}
              <div className="relative border-b border-white/10 px-6 py-5">

                <div className="flex items-center justify-between">

                  <div className="flex flex-col gap-3">

                    <SectionLabel>
                      Processing Pipeline
                    </SectionLabel>

                    <p className="mt-1 text-sm text-slate-400">
                      Monitor real-time execution flow of the KG ingestion pipeline
                    </p>

                    <div
                      className="
                      flex items-center gap-2 rounded-full
                      border border-violet-400/20
                      bg-violet-400/10
                      px-4 py-2
                    "
                    >
                      <Activity className="h-4 w-4 text-violet-300 animate-pulse" />

                      <span
                        className="
                        font-mono text-[10px]
                        tracking-[0.16em]
                        text-violet-300
                      "
                      >
                        LIVE EXECUTION FLOW
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="relative flex flex-col gap-3  border-b border-white/10 p-6 md:grid-cols-3">

                {/* Metric */}
                <div
                  className="
                  rounded-2xl border border-white/10
                  bg-white/[0.03]
                  p-4
                  transition-all duration-300
                  hover:border-cyan-400/20
                  hover:bg-white/[0.05]
                  hover:-translate-y-0.5
                "
                >
                  <div className="font-mono text-[10px] tracking-[0.14em] text-slate-400">
                    DOCUMENTS
                  </div>

                  <div className="mt-2 text-2xl font-semibold text-white">
                    {files.length}
                  </div>

                  <div className="mt-1 text-xs text-emerald-300">
                    Ready for ingestion
                  </div>
                </div>

                {/* Metric */}
                <div
                  className="
                  rounded-2xl border border-white/10
                  bg-white/[0.03]
                  p-4
                  transition-all duration-300
                  hover:border-cyan-400/20
                  hover:bg-white/[0.05]
                  hover:-translate-y-0.5
                "
                >
                  <div className="font-mono text-[10px] tracking-[0.14em] text-slate-400">
                    PIPELINE STATUS
                  </div>

                  <div className="mt-2 flex items-center gap-2">

                    <Activity
                      className={`h-4 w-4 ${running
                          ? "text-amber-300 animate-pulse"
                          : "text-cyan-300"
                        }`}
                    />

                    <span className="text-lg font-semibold text-white">
                      {running ? "Processing" : "Idle"}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Execution engine state
                  </div>
                </div>

                {/* Metric */}
                <div
                  className="
                  rounded-2xl border border-white/10
                  bg-white/[0.03]
                  p-4
                  transition-all duration-300
                  hover:border-cyan-400/20
                  hover:bg-white/[0.05]
                  hover:-translate-y-0.5
                "
                >
                  <div className="font-mono text-[10px] tracking-[0.14em] text-slate-400">
                    TARGET SYSTEM
                  </div>

                  <div className="mt-2 text-2xl font-semibold text-white">
                    Neo4j
                  </div>

                  {running ? (
                    <div className="mt-1 text-xs text-yellow-300">
                      GraphXR visualization is being prepared
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-green-300">
                      GraphXR visualization ready
                    </div>
                  )}
                </div>
              </div>

              {/* Flow Area */}
              <div className="relative p-6">

                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-semibold tracking-[0.08em] text-white">
                      PIPELINE EXECUTION STAGES
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Sequential processing stages for document-to-graph transformation
                    </p>
                  </div>

                  <div
                    className="
                    rounded-full border border-cyan-400/20
                    bg-cyan-400/10 px-3 py-1
                    font-mono text-[10px]
                    tracking-[0.12em]
                    text-cyan-300
                  "
                  >
                    {steps.length} STAGES
                  </div>
                </div>

                <div
                  className="
                  rounded-2xl border border-white/10
                  bg-black/20 p-5
                "
                >
                  <PipelineFlow steps={steps} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS */}
        {activeTab === "stats" && (
          <div className="p-6">

            <div
              className="
              rounded-3xl border border-white/10
              bg-gradient-to-b from-[#121B28] to-[#0F1722]
              p-6
              shadow-[0_0_35px_rgba(0,0,0,0.35)]
            "
            >
              <div className="flex items-center justify-between">

                <SectionLabel>
                  Graph Statistics
                </SectionLabel>

                <div
                  className="
                  rounded-full border border-emerald-400/20
                  bg-emerald-400/10 px-3 py-1
                  font-mono text-[10px]
                  tracking-[0.14em] text-emerald-300
                "
                >
                  ANALYTICS DASHBOARD
                </div>
              </div>

              <div className="mt-6">
                <GraphStats />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-white/10 bg-[#0D141D]/95 p-5 backdrop-blur-xl">

        <div className="flex gap-3">

          {/* Clear */}
          <button
            onClick={onClear}
            className="
            rounded-2xl border border-white/10
            bg-white/[0.03]
            px-6 py-3
            text-xs font-semibold tracking-[0.14em]
            text-slate-300
            transition-all duration-300
            hover:border-white/20
            hover:bg-white/[0.06]
            hover:text-white
          "
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>CLEAR</span>
            </div>
          </button>

          {/* Process */}
          <button
            onClick={handleRun}
            disabled={running}
            className={`
            group flex flex-1 items-center justify-center gap-3
            rounded-2xl border px-6 py-3
            text-xs font-semibold tracking-[0.14em]
            transition-all duration-300
            ${running
                ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                : "border-cyan-400/25 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/15 hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]"
              }
          `}
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            )}

            {running
              ? "PROCESSING KNOWLEDGE GRAPH..."
              : "PROCESS & BUILD KG"}
          </button>
        </div>
      </div>
    </div>
  );
}