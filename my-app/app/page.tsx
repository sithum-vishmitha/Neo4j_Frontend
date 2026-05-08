"use client";
import { useState, useCallback } from "react";
import { Starfield } from "@/app/components/ui/Starfield";
import { Header } from "@/app/components/ui/Header";
import { Toast } from "@/app/components/ui/Toast";
import { LeftPanel } from "@/app/components/pipeline/LeftPanel";
import { GraphViewport } from "@/app/components/graph/GraphViewport";
import { useFileUpload } from "@/app/hooks/Usefileupload";
import { usePipeline } from "@/app/hooks/usePipeline";

export default function Home() {
  const { files, addFiles, removeFile, clearFiles, updateFile } = useFileUpload();
  const [toastMsg, setToastMsg]   = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastKey, setToastKey]   = useState(0);

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
    start();
  };

  const handleClear = () => {
    clearFiles();
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