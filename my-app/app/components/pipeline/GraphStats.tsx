"use client";
import { GRAPH_STATS, NODE_COLORS } from "@/app/lib/graphData";
import type { NodeType } from "@/app/types";

export function GraphStats() {
  const { nodes, relationships, nodeTypes, relTypes, nodeDistribution, relDistribution } = GRAPH_STATS;
  const maxNode = Math.max(...Object.values(nodeDistribution));
  const maxRel  = Math.max(...Object.values(relDistribution));

  const metricCards = [
    { val: nodes,         label: "Total Nodes",     color: "var(--cyan)",   sub: "from pipeline" },
    { val: relationships, label: "Relationships",   color: "var(--purple)", sub: "from CSV rows" },
    { val: nodeTypes,     label: "Node Types",      color: "var(--teal)",   sub: "Location, Fish…" },
    { val: relTypes,      label: "Relation Types",  color: "var(--amber)",  sub: "FOUND_IN, MADE_OF…" },
  ];

  return (
    <div className="flex flex-col gap-5 overflow-y-auto" style={{ padding: "20px 24px" }}>
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-2">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className="rounded-lg p-3 transition-colors"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: m.color, lineHeight: 1 }}>
              {m.val.toLocaleString()}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>
              {m.label}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Node distribution */}
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase" }}>
          Node Type Distribution
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(nodeDistribution).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2">
              <div style={{ width: 76, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)", textAlign: "right" }}>
                {type}
              </div>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${((count / maxNode) * 100).toFixed(0)}%`,
                    background: NODE_COLORS[type as NodeType] ?? "#94a3b8",
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <div style={{ width: 22, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-primary)", textAlign: "right" }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship distribution */}
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase" }}>
          Top Relationship Types
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(relDistribution).map(([rel, count]) => (
            <div key={rel} className="flex items-center gap-2">
              <div className="flex-1" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-secondary)" }}>
                {rel}
              </div>
              <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${((count / maxRel) * 100).toFixed(0)}%`, background: "var(--cyan)" }}
                />
              </div>
              <div style={{ width: 20, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-primary)", textAlign: "right" }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}