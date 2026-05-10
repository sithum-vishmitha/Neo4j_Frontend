"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

import type { KGNode, KGEdge } from "@/app/types";

import {
  INITIAL_NODES,
  INITIAL_EDGES,
  NODE_COLORS,
} from "@/app/lib/graphData";

import {
  layoutRadial,
  layoutGrid,
  getNodeRadius,
  edgeEndpoint,
} from "@/app/lib/graphLayout";

interface Tooltip {
  node: KGNode;
  x: number;
  y: number;
}

export function GraphViewport() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<KGNode[]>([]);
  const [edges] = useState<KGEdge[]>(INITIAL_EDGES);

  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const [zoom, setZoom] = useState(1);

  const [pan, setPan] = useState({
    x: 0,
    y: 0,
  });
  

  const [layoutMode, setLayoutMode] = useState(0);

  const isPanning = useRef(false);

  const panStart = useRef({
    mx: 0,
    my: 0,
    px: 0,
    py: 0,
  });

  const dims = useRef({
    w: 800,
    h: 500,
  });

  const animationRef = useRef<number | null>(null);


  

  const relayout = useCallback((mode: number) => {
    const { w, h } = dims.current;

    setNodes(
      mode === 0
        ? layoutRadial(
            INITIAL_NODES.map((n) => ({ ...n })),
            w,
            h
          )
        : layoutGrid(
            INITIAL_NODES.map((n) => ({ ...n })),
            w
          )
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const obs = new ResizeObserver(([entry]) => {
      dims.current = {
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      };

      relayout(layoutMode);
    });

    obs.observe(el);

    return () => obs.disconnect();
  }, [layoutMode, relayout]);

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();

      setZoom((z) =>
        Math.max(
          0.25,
          Math.min(4, z * (e.deltaY > 0 ? 0.9 : 1.1))
        )
      );
    };

    svg.addEventListener("wheel", handler, {
      passive: false,
    });

    return () => svg.removeEventListener("wheel", handler);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;

    panStart.current = {
      mx: e.clientX,
      my: e.clientY,
      px: pan.x,
      py: pan.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;

    setPan({
      x:
        panStart.current.px +
        (e.clientX - panStart.current.mx),

      y:
        panStart.current.py +
        (e.clientY - panStart.current.my),
    });
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  const handleNodeEnter = (
    e: React.MouseEvent,
    node: KGNode
  ) => {
    const rect =
      containerRef.current?.getBoundingClientRect();

    if (!rect) return;

    setTooltip({
      node,
      x: e.clientX - rect.left + 16,
      y: e.clientY - rect.top + 16,
    });
  };

  const handleNodeLeave = () => {
    setTooltip(null);
  };

  const toggleLayout = () => {
    const next = (layoutMode + 1) % 2;

    setLayoutMode(next);

    relayout(next);
  };

  const nodeMap = Object.fromEntries(
    nodes.map((n) => [n.id, n])
  );

  const { w: svgW, h: svgH } = dims.current;

  return (
    <div className="flex h-full flex-col bg-[#060B14] text-white">

      {/* HEADER */}
      <div
        className="
          flex items-center justify-between
          border-b border-white/10
          bg-black/30
          px-6 py-4
          backdrop-blur-xl
        "
      >
        {/* Left */}
        <div className="flex items-center gap-4">

          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-2xl
              border border-cyan-400/20
              bg-cyan-400/10
            "
          >
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>

          <div>
            <div className="text-sm font-semibold tracking-[0.08em] text-white">
              KNOWLEDGE GRAPH VIEWPORT
            </div>

            <div className="mt-1 text-xs text-slate-400">
              Neo4j-style graph visualization engine
            </div>
          </div>

          <div
            className="
              rounded-full border border-violet-400/20
              bg-violet-400/10
              px-3 py-1
              font-mono text-[10px]
              tracking-[0.16em]
              text-violet-300
            "
          >
            LIVE GRAPH
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">

          {/* Zoom In */}
          <button
            onClick={() =>
              setZoom((z) => Math.min(4, z * 1.2))
            }
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/10
              bg-white/[0.03]
              transition-all duration-300
              hover:border-cyan-400/20
              hover:bg-cyan-400/10
            "
          >
            <ZoomIn className="h-4 w-4 text-slate-300" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() =>
              setZoom((z) => Math.max(0.25, z / 1.2))
            }
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/10
              bg-white/[0.03]
              transition-all duration-300
              hover:border-cyan-400/20
              hover:bg-cyan-400/10
            "
          >
            <ZoomOut className="h-4 w-4 text-slate-300" />
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              setZoom(1);

              setPan({
                x: 0,
                y: 0,
              });
            }}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/10
              bg-white/[0.03]
              transition-all duration-300
              hover:border-cyan-400/20
              hover:bg-cyan-400/10
            "
          >
            <RotateCcw className="h-4 w-4 text-slate-300" />
          </button>

          {/* Layout */}
          <button
            onClick={toggleLayout}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl border border-white/10
              bg-white/[0.03]
              transition-all duration-300
              hover:border-cyan-400/20
              hover:bg-cyan-400/10
            "
          >
            <LayoutGrid className="h-4 w-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* GRAPH AREA */}
      <div
        ref={containerRef}
        className="
          relative flex-1 overflow-hidden
          bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_35%)]
        "
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          cursor: isPanning.current
            ? "grabbing"
            : "grab",
        }}
      >

        {/* GRID */}
        <div
          className="
            absolute inset-0 opacity-[0.03]
            bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)]
            bg-[size:40px_40px]
          "
        />

        {/* LEGEND */}
        <div
          className="
            absolute left-5 top-5 z-20
            rounded-2xl border border-white/10
            bg-black/40
            px-4 py-4
            backdrop-blur-xl
            shadow-[0_0_40px_rgba(0,0,0,0.45)]
          "
        >
          <div
            className="
              mb-3 text-xs font-semibold
              tracking-[0.18em]
              text-slate-400
            "
          >
            NODE TYPES
          </div>

          <div className="space-y-2">
            {Object.entries(NODE_COLORS).map(
              ([type, color]) => (
                <div
                  key={type}
                  className="flex items-center gap-3"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      background: color,
                      boxShadow: `0 0 12px ${color}`,
                    }}
                  />

                  <span className="text-xs text-slate-200">
                    {type}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* SVG */}
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{
            display: "block",
          }}
        >
          <defs>

            {/* Glow */}
            <filter
              id="glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="3"
                result="coloredBlur"
              />

              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Arrow */}
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                fill="rgba(148,163,184,0.7)"
              />
            </marker>
          </defs>

          <g
            transform={`
              translate(${pan.x},${pan.y})
              scale(${zoom})
            `}
          >

            {/* EDGES */}
            {edges.map((edge) => {
              const src = nodeMap[edge.source];

              const tgt = nodeMap[edge.target];

              if (!src || !tgt) return null;

              const rSrc = getNodeRadius(src.type);

              const rTgt = getNodeRadius(tgt.type);

              const ep1 = edgeEndpoint(
                src,
                tgt,
                rSrc
              );

              const ep2 = edgeEndpoint(
                tgt,
                src,
                rTgt
              );

              const dx = ep2.x - ep1.x;

              const dy = ep2.y - ep1.y;

              const curve = 0.18;

              const cx =
                ((ep1.x + ep2.x) / 2 - dy * curve);

              const cy =
                ((ep1.y + ep2.y) / 2 + dx * curve);

              return (
                <g key={edge.id}>

                  {/* Glow */}
                  <path
                    d={`M ${ep1.x} ${ep1.y} Q ${cx} ${cy} ${ep2.x} ${ep2.y}`}
                    stroke="rgba(34,211,238,0.12)"
                    strokeWidth={6}
                    fill="none"
                  />

                  {/* Main */}
                  <path
                    d={`M ${ep1.x} ${ep1.y} Q ${cx} ${cy} ${ep2.x} ${ep2.y}`}
                    stroke="rgba(148,163,184,0.45)"
                    strokeWidth={1.6}
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />

                  {/* Label */}
                  <text
                    x={cx}
                    y={cy - 8}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize={9}
                    fontWeight={500}
                    style={{
                      letterSpacing: "0.04em",
                    }}
                  >
                    {edge.rel}
                  </text>
                </g>
              );
            })}

            {/* NODES */}
            {nodes.map((node) => {
              const r = getNodeRadius(node.type);

              const color =
                NODE_COLORS[node.type] ??
                "#94A3B8";

              const label =
                node.name.length > 16
                  ? node.name.slice(0, 15) + "…"
                  : node.name;

              return (
                <g
                  key={node.id}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    handleNodeEnter(e, node)
                  }
                  onMouseLeave={handleNodeLeave}
                >

                  {/* Outer glow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 14}
                    fill={color}
                    opacity={0.05}
                  />

                  {/* Secondary glow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 7}
                    fill={color}
                    opacity={0.08}
                  />

                  {/* Main node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r}
                    fill="#0F172A"
                    stroke={color}
                    strokeWidth={2.2}
                    filter="url(#glow)"
                  />

                  {/* Ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 2}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.25}
                    strokeWidth={3}
                  />

                  {/* Highlight */}
                  <circle
                    cx={node.x - r * 0.25}
                    cy={node.y - r * 0.25}
                    r={r * 0.35}
                    fill="rgba(255,255,255,0.08)"
                  />

                  {/* Type */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={color}
                    fontSize={8}
                    fontWeight={700}
                    style={{
                      letterSpacing: "0.08em",
                    }}
                  >
                    {node.type.toUpperCase()}
                  </text>

                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + r + 18}
                    textAnchor="middle"
                    fill="#E2E8F0"
                    fontSize={10}
                    fontWeight={600}
                    style={{
                      letterSpacing: "0.03em",
                    }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* TOOLTIP */}
        {tooltip && (
          <div
            className="
              pointer-events-none
              absolute z-50
              rounded-2xl border border-cyan-400/20
              bg-black/70
              px-4 py-3
              backdrop-blur-xl
              shadow-[0_0_35px_rgba(0,0,0,0.55)]
            "
            style={{
              left: Math.min(
                tooltip.x,
                (svgW || 800) - 240
              ),

              top: Math.min(
                tooltip.y,
                (svgH || 500) - 120
              ),

              maxWidth: 220,
            }}
          >
            <div
              className="
                mb-2 font-mono text-[10px]
                tracking-[0.16em]
                text-cyan-300
              "
            >
              {tooltip.node.type.toUpperCase()}
            </div>

            <div className="mb-2 text-sm font-semibold text-white">
              {tooltip.node.name}
            </div>

            <div
              className="
                font-mono text-[10px]
                text-slate-400
              "
            >
              UID ·{" "}
              {tooltip.node.uid ??
                tooltip.node.id}
            </div>
          </div>
        )}

        {/* STATUS */}
        <div
          className="
            absolute bottom-5 left-5
            rounded-full border border-emerald-400/20
            bg-emerald-400/10
            px-4 py-2
            font-mono text-[10px]
            tracking-[0.16em]
            text-emerald-300
            backdrop-blur-xl
          "
        >
          {nodes.length} NODES · {edges.length} EDGES
        </div>
      </div>
    </div>
  );
}