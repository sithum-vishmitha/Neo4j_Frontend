import type { KGNode, NodeType } from "../types";
import { NODE_COLORS } from "./graphData";

export function layoutRadial(nodes: KGNode[], width: number, height: number): KGNode[] {
  const types = [...new Set(nodes.map((n) => n.type))] as NodeType[];
  const cx = width / 2;
  const cy = height / 2;

  return nodes.map((node) => {
    const ti = types.indexOf(node.type as NodeType);
    const angle = (ti / types.length) * Math.PI * 2;
    const r = 160 + Math.random() * 70;
    return {
      ...node,
      x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 90,
      y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 70,
    };
  });
}

export function layoutGrid(nodes: KGNode[], width: number): KGNode[] {
  const cols = 6;
  const padX = 80;
  const padY = 80;
  const stepX = (width - padX * 2) / (cols - 1);
  const stepY = 90;

  return nodes.map((node, i) => ({
    ...node,
    x: padX + (i % cols) * stepX + (Math.random() - 0.5) * 15,
    y: padY + Math.floor(i / cols) * stepY + (Math.random() - 0.5) * 10,
  }));
}

export function getNodeColor(type: string): string {
  return NODE_COLORS[type as NodeType] ?? "#94a3b8";
}

export function getNodeRadius(type: string): number {
  if (type === "Location") return 22;
  if (type === "Fish" || type === "Concept") return 18;
  return 15;
}
export function edgeEndpoint(
  from: KGNode,
  to: KGNode,
  radius: number
): { x: number; y: number } {

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const len =
    Math.sqrt(dx * dx + dy * dy) || 1;

  // Extra spacing between node and edge
  const gap = 10;

  return {
    x:
      from.x +
      (dx / len) * (radius + gap),

    y:
      from.y +
      (dy / len) * (radius + gap),
  };
}