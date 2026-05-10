import type { KGNode, KGEdge, GraphStats, NodeType } from "@/app/types";
import { color_formatter } from "./graphLayout";


export const INITIAL_NODES: KGNode[] = [

  
];

export const INITIAL_EDGES: KGEdge[] = [

 
];


export const NODE_COLORS =  color_formatter(
  INITIAL_NODES.map((n)=> n.type)
)

export const GRAPH_STATS: GraphStats = {
  nodes: 798,
  relationships: 787,
  nodeTypes: 9,
  relTypes: 18,
  nodeDistribution: {
    Location: 22, Tool: 18, Fish: 12, Concept: 10,
    Attribute: 8, Craft: 6, Activity: 5, Group: 4, Threat: 3,
  },
  relDistribution: {
    LOCATED_IN: 22, MADE_OF: 18, FOUND_IN: 14, USED_IN: 12,
    SUPPORTS: 10, OPERATED_IN: 8, PRACTICED_IN: 6, AFFECTS: 4,
  },
};


export const PIPELINE_STEPS = [
  { id: 0, name: "PDF Ingestion",       description: "Extract text, tables & figures" },
  { id: 1, name: "NLP Entity Extraction", description: "NER + relation detection via LLM" },
  { id: 2, name: "Graph Construction",  description: "Map entities → nodes, relations → edges" },
  { id: 3, name: "Neo4j Write",         description: "MERGE nodes + relationships via Cypher" },
  { id: 4, name: "GraphXR Sync",        description: "Stream KG to 3D visualisation engine" },
];