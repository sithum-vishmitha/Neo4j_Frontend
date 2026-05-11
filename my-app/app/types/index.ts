export type NodeType = string
export interface KGNode {
  id: string;
  type: NodeType;
  name: string;
  uid?: string;
  x: number;
  y: number;
}

export type NodeRel =  Record<string , number>
export type relDub =  Record<string , number>

export interface KG_GRAPGH_STATS {
  nodes: number,
  relationships: number,
  nodeTypes: number,
  relTypes: number,
  nodeDistribution:NodeRel
  relDistribution: relDub

}


export interface KGEdge {
  id: string;
  source: string;
  target: string;
  rel: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  status: "queued" | "processing" | "done" | "error";
  progress: number;
}

export type PipelineStepStatus = "idle" | "active" | "done" | "error";

export interface PipelineStep {
  id: number;
  name: string;
  description: string;
  status: PipelineStepStatus;
  progress: number;
}

export interface GraphStats {
  nodes: number;
  relationships: number;
  nodeTypes: number;
  relTypes: number;
  nodeDistribution: Record<string, number>;
  relDistribution: Record<string, number>;
}