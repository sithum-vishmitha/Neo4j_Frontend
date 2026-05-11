import { object } from "framer-motion/client";
import type { KGEdge, KGNode, NodeType, GraphStats } from "../types";
import { NODE_COLORS } from "./graphData";


export function color_formatter(node_types: NodeType[]): Record<string, string> {

  const palette = [
    "#00d4ff",
    "#00c896",
    "#a78bfa",
    "#f5a623",
    "#ff6b6b",
    "#ff4444",
    "#64d2ff",
    "#e879f9",
    "#94a3b8",
  ];



  const uniqueTypes = [
    ...new Set(node_types),
  ]

  const colors: Record<string, string> | any = {};

  uniqueTypes.forEach((type, index) => {
    colors[type] = palette[index % palette.length]
  })


  return colors
}

export function layoutRadial(
  nodes: KGNode[],
  width: number,
  height: number
): KGNode[] {

  const types = [
    ...new Set(nodes.map((n) => n.type)),
  ] as NodeType[];

  const cx = width / 2;
  const cy = height / 2;

  // MUCH larger spread
  const baseRadius =
    Math.min(width, height) * 0.38;

  return nodes.map((node) => {

    const ti = types.indexOf(
      node.type as NodeType
    );

    const angle =
      (ti / types.length) * Math.PI * 2;

    // Better spacing between layers
    const radius =
      baseRadius +
      Math.random() * 120;

    // More natural spread
    const offsetX =
      (Math.random() - 0.5) * 140;

    const offsetY =
      (Math.random() - 0.5) * 120;

    return {
      ...node,

      x:
        cx +
        Math.cos(angle) * radius +
        offsetX,

      y:
        cy +
        Math.sin(angle) * radius +
        offsetY,
    };
  });
}

export function layoutGrid(
  nodes: KGNode[],
  width: number
): KGNode[] {

  // More columns for breathing room
  const cols = 5;

  // Bigger padding
  const padX = 140;
  const padY = 120;

  // Much larger spacing
  const stepX =
    (width - padX * 2) / (cols - 1);

  const stepY = 180;

  return nodes.map((node, i) => ({

    ...node,

    x:
      padX +
      (i % cols) * stepX +
      (Math.random() - 0.5) * 25,

    y:
      padY +
      Math.floor(i / cols) * stepY +
      (Math.random() - 0.5) * 25,
  }));
}

export function getNodeColor(
  type: string
): string {

  return (
    NODE_COLORS[type as NodeType] ??
    "#94a3b8"
  );
}

export function getNodeRadius(
  type: string
): number {

  // Bigger nodes for clarity
  if (type === "Location") return 32;

  if (
    type === "Fish" ||
    type === "Concept"
  ) {
    return 26;
  }

  return 22;
}

/** Compute edge endpoint with spacing */
export function edgeEndpoint(
  from: KGNode,
  to: KGNode,
  radius: number
): { x: number; y: number } {

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const len =
    Math.sqrt(dx * dx + dy * dy) || 1;

  // MUCH cleaner edge spacing
  const gap = 18;

  return {

    x:
      from.x +
      (dx / len) * (radius + gap),

    y:
      from.y +
      (dy / len) * (radius + gap),
  };
}


export const GRAPH_STATS: GraphStats = {
  nodes: 7,
  relationships: 787,
  nodeTypes: 0,
  relTypes: 18,
  nodeDistribution: {
    Organization: 22, Tool: 18, Fish: 12, Concept: 10,
    Attribute: 8, Craft: 6, Activity: 5, Group: 4, Threat: 3,
  },
  relDistribution: {
    LOCATED_IN: 22, MADE_OF: 18, FOUND_IN: 14, USED_IN: 12,
    SUPPORTS: 10, OPERATED_IN: 8, PRACTICED_IN: 6, AFFECTS: 4,
  },
};


