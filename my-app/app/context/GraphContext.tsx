

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import type {
  KGNode,
  KGEdge,
} from "@/app/types";

import {
  INITIAL_NODES,
  INITIAL_EDGES,
} from "@/app/lib/graphData";
import { color_formatter } from "../lib/graphLayout";

/* =========================
   Context Type
========================= */

interface GraphContextType {
  nodes: KGNode[];
  edges: KGEdge[];
  nodeColors  : Record<string , string>

  setNodes: React.Dispatch<
    React.SetStateAction<KGNode[]>
  >;

  setEdges: React.Dispatch<
    React.SetStateAction<KGEdge[]>
  >

}

/* =========================
   Context
========================= */

const GraphContext =
  createContext<GraphContextType | null>(
    null
  );

/* =========================
   Provider
========================= */

export function GraphProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [nodes, setNodes] =
    useState<KGNode[]>(INITIAL_NODES);

  const [edges, setEdges] =
    useState<KGEdge[]>(INITIAL_EDGES);


  const nodeColors  = color_formatter(
    nodes.map((n) => n.type)
  )

  return (
    <GraphContext.Provider
      value={{
        nodes,
        edges,

        setNodes,
        setEdges,

        nodeColors,

      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useGraph() {

  const context =
    useContext(GraphContext);

  if (!context) {
    throw new Error(
      "useGraph must be used inside GraphProvider"
    );
  }

  return context;
}