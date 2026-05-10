"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type { KGNode, KGEdge } from "@/app/types";
import { INITIAL_NODES, INITIAL_EDGES, CSV_SAMPLES, NODE_COLORS } from "@/app/lib/graphData";
import { layoutRadial, layoutGrid, getNodeRadius, edgeEndpoint } from "@/app/lib/graphLayout";
import type { NodeType } from "@/app/types";

interface Tooltip {
  node: KGNode;
  x: number;
  y: number;
}

export function GraphViewport() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<KGNode[]>([]);
  const [edges]  = useState<KGEdge[]>(INITIAL_EDGES);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [zoom, setZoom]   = useState(1);
  const [pan, setPan]     = useState({ x: 0, y: 0 });
  const [layoutMode, setLayoutMode] = useState(0);
  const isPanning = useRef(false);
  const panStart  = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const dims      = useRef({ w: 800, h: 500 });

  const relayout = useCallback((mode: number) => {
    const { w, h } = dims.current;
    setNodes(
      mode === 0
        ? layoutRadial(INITIAL_NODES.map(n => ({ ...n })), w, h)
        : layoutGrid(INITIAL_NODES.map(n => ({ ...n })), w)
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      dims.current = { w: entry.contentRect.width, h: entry.contentRect.height };
      relayout(layoutMode);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [relayout, layoutMode]);

  // Wheel zoom
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(z => Math.max(0.25, Math.min(4, z * (e.deltaY > 0 ? 0.9 : 1.1))));
    };
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    panStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPan({
      x: panStart.current.px + (e.clientX - panStart.current.mx),
      y: panStart.current.py + (e.clientY - panStart.current.my),
    });
  };
  const onMouseUp = () => { isPanning.current = false; };

  const handleNodeEnter = (e: React.MouseEvent, node: KGNode) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ node, x: e.clientX - rect.left + 14, y: e.clientY - rect.top + 14 });
  };
  const handleNodeLeave = () => setTooltip(null);

  const toggleLayout = () => {
    const next = (layoutMode + 1) % 2;
    setLayoutMode(next);
    relayout(next);
  };

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const { w: svgW, h: svgH } = dims.current;

  return (
    <div className="flex flex-col h-full text-white" style={{ background: "var(--ink)" }}>
      {/* Viewport header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
        style={{ borderColor: "var(--border)", background: "rgba(13,17,23,0.85)", backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 16, color: "var(--purple)" }}>◈</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Neo4j + GraphXR Viewport</span>
          <span
            className="rounded px-2 py-0.5"
            style={{
              background: "var(--purple-dim)",
              border: "1px solid rgba(167,139,250,0.3)",
              color: "var(--purple)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
            }}
          >
            LIVE PREVIEW
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[
            { icon: "+", action: () => setZoom(z => Math.min(4, z * 1.2)),  tip: "Zoom in" },
            { icon: "−", action: () => setZoom(z => Math.max(0.25, z / 1.2)), tip: "Zoom out" },
            { icon: "⊡", action: () => { setZoom(1); setPan({ x: 0, y: 0 }); }, tip: "Reset" },
            { icon: "⇄", action: toggleLayout, tip: "Toggle layout" },
          ].map(({ icon, action, tip }) => (
            <button
              key={tip}
              title={tip}
              onClick={action}
              className="flex items-center justify-center rounded transition-all"
              style={{
                width: 30, height: 30,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--text-secondary)",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: isPanning.current ? "grabbing" : "grab" }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M1 1L8 5L1 9" fill="none" stroke="#1a2535" strokeWidth="2" strokeLinecap="round"/>
            </marker>
          </defs>

          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const src = nodeMap[edge.source];
              const tgt = nodeMap[edge.target];
              if (!src || !tgt) return null;
              const rSrc = getNodeRadius(src.type);
              const rTgt = getNodeRadius(tgt.type);
              const ep1 = edgeEndpoint(src, tgt, rSrc);
              const ep2 = edgeEndpoint(tgt, src, rTgt);
              const mx  = (ep1.x + ep2.x) / 2;
              const my  = (ep1.y + ep2.y) / 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={ep1.x} y1={ep1.y} x2={ep2.x} y2={ep2.y}
                    stroke="#1a2535"
                    strokeWidth={1.5}
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={mx} y={my - 4}
                    textAnchor="middle"
                    fill="#253548"
                    fontSize={7}
                    fontFamily="var(--font-mono)"
                  >
                    {edge.rel}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const r     = getNodeRadius(node.type);
              const color = NODE_COLORS[node.type as NodeType] ?? "#94a3b8";
              const label = node.name.length > 12 ? node.name.slice(0, 11) + "…" : node.name;
              return (
                <g
                  key={node.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleNodeEnter(e, node)}
                  onMouseLeave={handleNodeLeave}
                >
                  {/* Outer glow ring */}
                  <circle cx={node.x} cy={node.y} r={r + 5} fill={color} opacity={0.04} />
                  {/* Main circle */}
                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill={color}
                    fillOpacity={0.15}
                    stroke={color}
                    strokeWidth={1.5}
                  />
                  {/* Label */}
                  <text
                    x={node.x} y={node.y + r + 11}
                    textAnchor="middle"
                    fill={color}
                    fillOpacity={0.85}
                    fontSize={8}
                    fontFamily="var(--font-mono)"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute rounded-lg px-3 py-2.5 z-20"
            style={{
              left: Math.min(tooltip.x, (svgW || 800) - 220),
              top: Math.min(tooltip.y, (svgH || 500) - 100),
              background: "var(--card)",
              border: "1px solid var(--cyan)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              maxWidth: 200,
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--cyan)", letterSpacing: "0.1em", marginBottom: 3 }}>
              {tooltip.node.type.toUpperCase()}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>
              {tooltip.node.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-secondary)", wordBreak: "break-all" }}>
              uid: {tooltip.node.uid ?? tooltip.node.id}
            </div>
          </div>
        )}

        {/* Legend */}
        <div
          className="absolute bottom-4 left-4 rounded-lg p-3"
          style={{ background: "rgba(13,17,23,0.92)", border: "1px solid var(--border)", backdropFilter: "blur(8px)" }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: 7, textTransform: "uppercase" }}>
            Node Types
          </div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2" style={{ fontSize: 10, color: "var(--text-primary)" }}>
                <div className="rounded-full" style={{ width: 7, height: 7, background: color, flexShrink: 0 }} />
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* CSV sample box */}
        <div
          className="absolute top-4 right-4 rounded-lg p-3"
          style={{ background: "rgba(13,17,23,0.92)", border: "1px solid var(--border)", backdropFilter: "blur(8px)", maxWidth: 230 }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase" }}>
            CSV · Cypher Paths
          </div>
          {CSV_SAMPLES.map((s, i) => (
            <div
              key={i}
              className="py-1"
              style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                color: "var(--text-primary)",
                borderBottom: i < CSV_SAMPLES.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ color: "var(--cyan)" }}>{s.a}</span>
              {" -["}
              <span style={{ color: "var(--amber)" }}>{s.rel}</span>
              {"]->"}&nbsp;
              <span style={{ color: "var(--teal)" }}>{s.b}</span>
            </div>
          ))}
        </div>

        {/* Minimap */}
        <div
          className="absolute bottom-4 right-4 rounded overflow-hidden"
          style={{ background: "rgba(13,17,23,0.92)", border: "1px solid var(--border)", width: 130, height: 80 }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-secondary)", padding: "3px 6px", letterSpacing: "0.1em" }}>
            MINIMAP
          </div>
          <svg width="130" height="62">
            {nodes.map((n) => {
              const allX = nodes.map(nd => nd.x);
              const allY = nodes.map(nd => nd.y);
              const minX = Math.min(...allX), maxX = Math.max(...allX);
              const minY = Math.min(...allY), maxY = Math.max(...allY);
              const scX = 110 / (maxX - minX || 1);
              const scY = 50  / (maxY - minY || 1);
              const sc  = Math.min(scX, scY) * 0.85;
              const color = NODE_COLORS[n.type as NodeType] ?? "#94a3b8";
              return (
                <circle
                  key={n.id}
                  cx={8  + (n.x - minX) * sc}
                  cy={6  + (n.y - minY) * sc}
                  r={2.5}
                  fill={color}
                  opacity={0.7}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}