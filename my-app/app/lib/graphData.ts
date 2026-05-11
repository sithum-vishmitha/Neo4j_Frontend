import type { KGNode, KGEdge, GraphStats, NodeType , NodeRel , relDub } from "@/app/types";
import { color_formatter } from "./graphLayout";
import { useGraph } from "../context/GraphContext";

export const INITIAL_NODES: KGNode[] = [

  
];

export const INITIAL_EDGES: KGEdge[] = [

 
];


export const NODE_COLORS =  color_formatter(
  INITIAL_NODES.map((n)=> n.type)
)






export function calculate_grapgh_statitics(
 

): GraphStats {

  const {nodes , edges}  =useGraph()
  const nodeDistribution: NodeRel = {}
  const relDistribution: relDub = {}


  nodes.forEach((node) => {
    nodeDistribution[node.type] = (nodeDistribution[node.type] || 0) + 1
  })

  edges.forEach((edge) => {
    relDistribution[edge.rel] = (relDistribution[edge.rel] || 0) + 1
  })

  return {
    nodes: nodes.length,
    relationships: edges.length,
    nodeTypes: Object.keys(nodeDistribution).length,
    relTypes: Object.keys(relDistribution).length,
    nodeDistribution,
    relDistribution
  };

}


export const PIPELINE_STEPS = [
  { id: 0, name: "PDF Ingestion",       description: "Extract text, tables & figures" },
  { id: 1, name: "NLP Entity Extraction", description: "NER + relation detection via LLM" },
  { id: 2, name: "Graph Construction",  description: "Map entities → nodes, relations → edges" },
  { id: 3, name: "Neo4j Write",         description: "MERGE nodes + relationships via Cypher" },
  { id: 4, name: "GraphXR Sync",        description: "Stream KG to 3D visualisation engine" },
];

