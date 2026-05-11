"use client";
import { useState, useCallback } from "react";
import { Starfield } from "@/app/components/ui/Starfield";
import { Header } from "@/app/components/ui/Header";
import { Toast } from "@/app/components/ui/Toast";
import { LeftPanel } from "@/app/components/pipeline/LeftPanel";
import { GraphViewport } from "@/app/components/graph/GraphViewport";
import { useFileUpload } from "@/app/hooks/Usefileupload";
import { usePipeline } from "@/app/hooks/usePipeline";
import { INITIAL_EDGES, INITIAL_NODES } from "./lib/graphData";
import { useGraph } from "./context/GraphContext";

export default function Home() {
  const { files, addFiles, removeFile, clearFiles, updateFile } = useFileUpload();
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const {
    nodes,
    edges,
    setEdges,
    setNodes,
  } = useGraph();

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastKey(k => k + 1);
    setToastShow(true);
  }, []);

  const onPipelineComplete = useCallback(() => {
    showToast(`KG built · GraphXR synced · ${files.length || 1} doc(s) processed · 787 paths loaded`);
  }, [files.length, showToast]);

  const { steps, running, start, reset } = usePipeline(onPipelineComplete);

  const handleRun = () => {
    // Mark all files as processing
    files.forEach((f, i) => {
      setTimeout(() => updateFile(f.id, { status: "processing" }), i * 350);
      setTimeout(() => updateFile(f.id, { status: "done" }), i * 350 + 1400);
    });

         setEdges([ /* Organizations -> Models */
      {
        id: "e1",
        source: "n1",
        target: "n4",
        rel: "DEVELOPS",
      },

      {
        id: "e2",
        source: "n2",
        target: "n5",
        rel: "DEVELOPS",
      },

      {
        id: "e3",
        source: "n3",
        target: "n6",
        rel: "DEVELOPS",
      },

      /* Models -> Technology */
      {
        id: "e4",
        source: "n4",
        target: "n7",
        rel: "USES",
      },

      {
        id: "e5",
        source: "n5",
        target: "n7",
        rel: "USES",
      },

      {
        id: "e6",
        source: "n6",
        target: "n7",
        rel: "USES",
      },

      /* Models -> Dataset */
      {
        id: "e7",
        source: "n4",
        target: "n10",
        rel: "TRAINED_ON",
      },

      {
        id: "e8",
        source: "n5",
        target: "n11",
        rel: "TRAINED_ON",
      },

      /* Researchers */
      {
        id: "e9",
        source: "n12",
        target: "n2",
        rel: "WORKED_AT",
      },

      {
        id: "e10",
        source: "n13",
        target: "n2",
        rel: "WORKED_AT",
      },

      {
        id: "e11",
        source: "n14",
        target: "n1",
        rel: "WORKED_AT",
      },

      /* Papers */
      {
        id: "e12",
        source: "n15",
        target: "n7",
        rel: "INTRODUCES",
      },

      {
        id: "e13",
        source: "n16",
        target: "n7",
        rel: "BASED_ON",
      },

      {
        id: "e14",
        source: "n17",
        target: "n9",
        rel: "RELATED_TO",
      },

      /* Risks */
      {
        id: "e15",
        source: "n18",
        target: "n4",
        rel: "AFFECTS",
      },

      {
        id: "e16",
        source: "n19",
        target: "n5",
        rel: "AFFECTS",
      },

      {
        id: "e17",
        source: "n20",
        target: "n23",
        rel: "IMPACTS",
      },

      /* Infrastructure */
      {
        id: "e18",
        source: "n21",
        target: "n4",
        rel: "POWERS",
      },

      {
        id: "e19",
        source: "n22",
        target: "n25",
        rel: "ENABLES",
      },

      /* Applications */
      {
        id: "e20",
        source: "n4",
        target: "n23",
        rel: "USED_IN",
      },

      {
        id: "e21",
        source: "n4",
        target: "n24",
        rel: "USED_IN",
      },

      {
        id: "e22",
        source: "n9",
        target: "n25",
        rel: "SUPPORTS",
      },

      /* Cross Connections */
      {
        id: "e23",
        source: "n8",
        target: "n4",
        rel: "IMPROVES",
      },

      {
        id: "e24",
        source: "n7",
        target: "n15",
        rel: "DESCRIBED_IN",
      },

      {
        id: "e25",
        source: "n1",
        target: "n21",
        rel: "OPERATES",
      },])

    setNodes([/* Organizations */
      {
        id: "n1",
        type: "Organization",
        name: "OpenAI",
        uid: "org_001",
        x: 0,
        y: 0,
      },

      {
        id: "n2",
        type: "Organization",
        name: "DeepMind",
        uid: "org_002",
        x: 0,
        y: 0,
      },

      {
        id: "n3",
        type: "Organization",
        name: "Anthropic",
        uid: "org_003",
        x: 0,
        y: 0,
      },

      /* Models */
      {
        id: "n4",
        type: "AIModel",
        name: "GPT-4",
        uid: "model_001",
        x: 0,
        y: 0,
      },

      {
        id: "n5",
        type: "AIModel",
        name: "Gemini",
        uid: "model_002",
        x: 0,
        y: 0,
      },

      {
        id: "n6",
        type: "AIModel",
        name: "Claude",
        uid: "model_003",
        x: 0,
        y: 0,
      },

      /* Technologies */
      {
        id: "n7",
        type: "Technology",
        name: "Transformer Architecture",
        uid: "tech_001",
        x: 0,
        y: 0,
      },

      {
        id: "n8",
        type: "Technology",
        name: "Reinforcement Learning",
        uid: "tech_002",
        x: 0,
        y: 0,
      },

      {
        id: "n9",
        type: "Technology",
        name: "Knowledge Graph",
        uid: "tech_003",
        x: 0,
        y: 0,
      },

      /* Datasets */
      {
        id: "n10",
        type: "Dataset",
        name: "Common Crawl",
        uid: "data_001",
        x: 0,
        y: 0,
      },

      {
        id: "n11",
        type: "Dataset",
        name: "Wikipedia",
        uid: "data_002",
        x: 0,
        y: 0,
      },

      /* Researchers */
      {
        id: "n12",
        type: "Researcher",
        name: "Geoffrey Hinton",
        uid: "res_001",
        x: 0,
        y: 0,
      },

      {
        id: "n13",
        type: "Researcher",
        name: "Yann LeCun",
        uid: "res_002",
        x: 0,
        y: 0,
      },

      {
        id: "n14",
        type: "Researcher",
        name: "Ilya Sutskever",
        uid: "res_003",
        x: 0,
        y: 0,
      },

      /* Papers */
      {
        id: "n15",
        type: "ResearchPaper",
        name: "Attention Is All You Need",
        uid: "paper_001",
        x: 0,
        y: 0,
      },

      {
        id: "n16",
        type: "ResearchPaper",
        name: "BERT",
        uid: "paper_002",
        x: 0,
        y: 0,
      },

      {
        id: "n17",
        type: "ResearchPaper",
        name: "Graph Neural Networks",
        uid: "paper_003",
        x: 0,
        y: 0,
      },

      /* Risks */
      {
        id: "n18",
        type: "Risk",
        name: "Hallucination",
        uid: "risk_001",
        x: 0,
        y: 0,
      },

      {
        id: "n19",
        type: "Risk",
        name: "Bias",
        uid: "risk_002",
        x: 0,
        y: 0,
      },

      {
        id: "n20",
        type: "Risk",
        name: "Misinformation",
        uid: "risk_003",
        x: 0,
        y: 0,
      },

      /* Infrastructure */
      {
        id: "n21",
        type: "Infrastructure",
        name: "GPU Clusters",
        uid: "infra_001",
        x: 0,
        y: 0,
      },

      {
        id: "n22",
        type: "Infrastructure",
        name: "Vector Database",
        uid: "infra_002",
        x: 0,
        y: 0,
      },

      /* Applications */
      {
        id: "n23",
        type: "Application",
        name: "Chatbot",
        uid: "app_001",
        x: 0,
        y: 0,
      },

      {
        id: "n24",
        type: "Application",
        name: "Code Assistant",
        uid: "app_002",
        x: 0,
        y: 0,
      },

      {
        id: "n25",
        type: "Application",
        name: "Semantic Search",
        uid: "app_003",
        x: 0,
        y: 0,
      },])
 
    start();
  };

  const handleClear = () => {
    clearFiles();
    setEdges([])
    setNodes([])

    reset();
  };

  return (
    <div className="relative flex flex-col" style={{ height: "100vh", overflow: "hidden" }}>
      <Starfield />

      <Header />

      {/* Main 2-column layout */}
      <main className="flex flex-1 overflow-hidden" style={{ position: "relative", zIndex: 1 }}>
        {/* Left panel — fixed 390px */}
        <div className="flex-shrink-0" style={{ width: 390 }}>
          <LeftPanel
            files={files}
            steps={steps}
            running={running}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
            onClear={handleClear}
            onRun={handleRun}
          />
        </div>

        {/* Right panel — graph viewport fills remaining space */}
        <div className="flex-1 overflow-hidden">
          <GraphViewport />
        </div>
      </main>

      <Toast key={toastKey} message={toastMsg} show={toastShow} type="success" />
    </div>
  );
}