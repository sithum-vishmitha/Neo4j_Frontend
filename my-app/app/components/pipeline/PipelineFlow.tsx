"use client";
import type { PipelineStep } from "@/app/types";

interface PipelineFlowProps {
  steps: PipelineStep[];
}

const stepIcon: Record<string, string> = {
  "PDF Ingestion":          "↑",
  "NLP Entity Extraction":  "⬡",
  "Graph Construction":     "⬢",
  "Neo4j Write":            "⏚",
  "GraphXR Sync":           "◈",
};

const statusColor = {
  idle:   "var(--border)",
  active: "var(--cyan)",
  done:   "var(--teal)",
  error:  "var(--coral)",
};

const statusBg = {
  idle:   "transparent",
  active: "var(--cyan-dim)",
  done:   "var(--teal-dim)",
  error:  "var(--coral-dim)",
};

export function PipelineFlow({ steps }: PipelineFlowProps) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-3 relative" style={{ paddingBottom: i < steps.length - 1 ? 16 : 0 }}>
          {/* Vertical connector line */}
          {i < steps.length - 1 && (
            <div
              className="absolute left-[14px] top-[30px] bottom-0 w-px"
              style={{
                background: step.status === "done"
                  ? "linear-gradient(to bottom, var(--teal), var(--border))"
                  : "var(--border)",
              }}
            />
          )}

          {/* Step dot */}
          <div
            className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300"
            style={{
              width: 30, height: 30,
              border: `1.5px solid ${statusColor[step.status]}`,
              background: statusBg[step.status],
              color: statusColor[step.status],
              boxShadow: step.status === "active" ? `0 0 12px ${statusColor.active}40` : "none",
              fontFamily: "var(--font-mono)",
              animation: step.status === "active" ? "spin 1.2s linear infinite" : "none",
            }}
          >
            {step.status === "done"  ? "✓"  :
             step.status === "active"? "◌"  :
             step.status === "error" ? "✕"  :
             stepIcon[step.name] ?? String(step.id + 1)}
          </div>

          {/* Info */}
          <div className="flex-1 pt-1">
            <div style={{ fontSize: 12, fontWeight: 600, color: step.status === "idle" ? "var(--text-secondary)" : "#fff" }}>
              {step.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>
              {step.description}
            </div>

            {/* Progress bar — only when active or done */}
            {(step.status === "active" || step.status === "done") && (
              <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${step.progress}%`,
                    background: step.status === "done"
                      ? "var(--teal)"
                      : "linear-gradient(90deg, var(--cyan), var(--teal))",
                  }}
                />
              </div>
            )}

            {/* Progress number */}
            {step.status === "active" && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--cyan)", marginTop: 3 }}>
                {step.progress}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}