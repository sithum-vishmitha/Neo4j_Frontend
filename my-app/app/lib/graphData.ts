import type { KGNode, KGEdge, GraphStats, NodeType } from "@/app/types";

export const NODE_COLORS: Record<NodeType, string> = {
  Location:  "#00d4ff",
  Fish:      "#00c896",
  Tool:      "#a78bfa",
  Concept:   "#f5a623",
  Activity:  "#ff6b6b",
  Threat:    "#ff4444",
  Group:     "#64d2ff",
  Craft:     "#e879f9",
  Attribute: "#94a3b8",
};

export const INITIAL_NODES: KGNode[] = [
  { id: "n1",  type: "Location",  name: "Payra River",        uid: "f863603d", x: 0, y: 0 },
  { id: "n2",  type: "Location",  name: "Amtali upazila",     uid: "f1906935", x: 0, y: 0 },
  { id: "n3",  type: "Location",  name: "Barguna district",   uid: "bc7d7a5b", x: 0, y: 0 },
  { id: "n4",  type: "Location",  name: "Bay of Bengal",      uid: "77a4c2a9", x: 0, y: 0 },
  { id: "n5",  type: "Location",  name: "Bangladesh",         uid: "ea61addf", x: 0, y: 0 },
  { id: "n6",  type: "Location",  name: "Burishwar river",    uid: "976e1c71", x: 0, y: 0 },
  { id: "n7",  type: "Fish",      name: "Tenualosa ilisha",   uid: "73253881", x: 0, y: 0 },
  { id: "n8",  type: "Fish",      name: "aquatic biota",      uid: "2552d521", x: 0, y: 0 },
  { id: "n9",  type: "Fish",      name: "Dhela",              uid: "fb5ea5c2", x: 0, y: 0 },
  { id: "n10", type: "Tool",      name: "Kosha",              uid: "6677ce24", x: 0, y: 0 },
  { id: "n11", type: "Tool",      name: "Dinghi",             uid: "3c4bfd95", x: 0, y: 0 },
  { id: "n12", type: "Tool",      name: "Trawler net",        uid: "a9b2c3d4", x: 0, y: 0 },
  { id: "n13", type: "Concept",   name: "commercial fishing", uid: "a1a58153", x: 0, y: 0 },
  { id: "n14", type: "Concept",   name: "fishery resources",  uid: "4af27734", x: 0, y: 0 },
  { id: "n15", type: "Concept",   name: "spawning grounds",   uid: "aaaaf6bb", x: 0, y: 0 },
  { id: "n16", type: "Concept",   name: "nursery grounds",    uid: "210c7db3", x: 0, y: 0 },
  { id: "n17", type: "Activity",  name: "katha fishing",      uid: "da901ff8", x: 0, y: 0 },
  { id: "n18", type: "Activity",  name: "hand catch",         uid: "7c62176a", x: 0, y: 0 },
  { id: "n19", type: "Threat",    name: "over fished",        uid: "ec0ee83c", x: 0, y: 0 },
  { id: "n20", type: "Threat",    name: "depleting fish stocks", uid: "2457ebff", x: 0, y: 0 },
  { id: "n21", type: "Group",     name: "fisheries dept.",    uid: "1d82b139", x: 0, y: 0 },
  { id: "n22", type: "Group",     name: "small scale fisheries", uid: "98156e25", x: 0, y: 0 },
  { id: "n23", type: "Craft",     name: "Kosha nouka",        uid: "9e96e4ac", x: 0, y: 0 },
  { id: "n24", type: "Craft",     name: "Dinghi nouka",       uid: "ee6badaf", x: 0, y: 0 },
  { id: "n25", type: "Attribute", name: "woods",              uid: "2524c8d9", x: 0, y: 0 },
  { id: "n26", type: "Attribute", name: "bamboos",            uid: "53705d1b", x: 0, y: 0 },
];

export const INITIAL_EDGES: KGEdge[] = [
  { id: "e1",  source: "n1",  target: "n2",  rel: "LOCATED_IN" },
  { id: "e2",  source: "n2",  target: "n3",  rel: "LOCATED_IN" },
  { id: "e3",  source: "n3",  target: "n5",  rel: "LOCATED_IN" },
  { id: "e4",  source: "n2",  target: "n4",  rel: "LOCATED_IN" },
  { id: "e5",  source: "n2",  target: "n6",  rel: "CONTAINS" },
  { id: "e6",  source: "n7",  target: "n1",  rel: "FOUND_IN" },
  { id: "e7",  source: "n8",  target: "n1",  rel: "PRESENT_IN" },
  { id: "e8",  source: "n9",  target: "n1",  rel: "FOUND_IN" },
  { id: "e9",  source: "n1",  target: "n13", rel: "SUPPORTS" },
  { id: "e10", source: "n1",  target: "n14", rel: "SUPPORTS" },
  { id: "e11", source: "n1",  target: "n15", rel: "PROVIDES" },
  { id: "e12", source: "n1",  target: "n16", rel: "PROVIDES" },
  { id: "e13", source: "n10", target: "n25", rel: "MADE_OF" },
  { id: "e14", source: "n10", target: "n26", rel: "MADE_OF" },
  { id: "e15", source: "n11", target: "n25", rel: "MADE_OF" },
  { id: "e16", source: "n17", target: "n1",  rel: "PRACTICED_IN" },
  { id: "e17", source: "n18", target: "n1",  rel: "PRACTICED_IN" },
  { id: "e18", source: "n19", target: "n1",  rel: "AFFECTS" },
  { id: "e19", source: "n20", target: "n19", rel: "CAUSED_BY" },
  { id: "e20", source: "n21", target: "n14", rel: "SUPPORTS" },
  { id: "e21", source: "n23", target: "n1",  rel: "OPERATES_IN" },
  { id: "e22", source: "n24", target: "n1",  rel: "OPERATES_IN" },
  { id: "e23", source: "n23", target: "n26", rel: "MADE_OF" },
  { id: "e24", source: "n7",  target: "n15", rel: "USES" },
  { id: "e25", source: "n12", target: "n1",  rel: "USED_IN" },
];

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

export const CSV_SAMPLES = [
  { a: "Payra River",      rel: "LOCATED_IN",    b: "Amtali upazila" },
  { a: "Tenualosa ilisha", rel: "FOUND_IN",       b: "Payra River" },
  { a: "Kosha",            rel: "MADE_OF",        b: "woods" },
  { a: "over fished",      rel: "AFFECTS",        b: "Payra River" },
  { a: "katha fishing",    rel: "PRACTICED_IN",   b: "Payra River" },
];

export const PIPELINE_STEPS = [
  { id: 0, name: "PDF Ingestion",       description: "Extract text, tables & figures" },
  { id: 1, name: "NLP Entity Extraction", description: "NER + relation detection via LLM" },
  { id: 2, name: "Graph Construction",  description: "Map entities → nodes, relations → edges" },
  { id: 3, name: "Neo4j Write",         description: "MERGE nodes + relationships via Cypher" },
  { id: 4, name: "GraphXR Sync",        description: "Stream KG to 3D visualisation engine" },
];