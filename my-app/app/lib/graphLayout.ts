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

export function layoutTree(
  nodes: KGNode[],
  edges: KGEdge[],
  width: number
): KGNode[] {
  if (nodes.length === 0) return [];

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const children = new Map<string, string[]>();
  const incomingCount = new Map<string, number>();

  nodes.forEach((node) => {
    children.set(node.id, []);
    incomingCount.set(node.id, 0);
  });

  edges.forEach((edge) => {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) return;

    children.get(edge.source)?.push(edge.target);
    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1);
  });

  const roots = nodes.filter((node) => (incomingCount.get(node.id) ?? 0) === 0);
  const startNodes = roots.length > 0 ? roots : [nodes[0]];

  const levels: string[][] = [];
  const visited = new Set<string>();

  const queue = startNodes.map((node) => ({
    id: node.id,
    level: 0,
  }));

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (!levels[current.level]) {
      levels[current.level] = [];
    }

    levels[current.level].push(current.id);

    for (const childId of children.get(current.id) ?? []) {
      queue.push({
        id: childId,
        level: current.level + 1,
      });
    }
  }

  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      if (!levels[0]) levels[0] = [];
      levels[0].push(node.id);
    }
  });

  const topPadding = 120;
  const levelGap = 180;

  return nodes.map((node) => {
    const levelIndex = levels.findIndex((level) => level.includes(node.id));
    const level = levels[levelIndex] ?? [];
    const index = level.indexOf(node.id);

    const xGap = width / (level.length + 1);

    return {
      ...node,
      x: xGap * (index + 1),
      y: topPadding + levelIndex * levelGap,
    };
  });
}

export function getNodeColor(
  type: string
): string {

  return (
    NODE_COLORS[type as any] ??
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





