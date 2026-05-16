"use client";
import { useState, useCallback, useEffect } from "react";
import { Starfield } from "@/app/components/ui/Starfield";
import { Header } from "@/app/components/ui/Header";
import { Toast } from "@/app/components/ui/Toast";
import { LeftPanel } from "@/app/components/pipeline/LeftPanel";
import { GraphViewport } from "@/app/components/graph/GraphViewport";
import { useFileUpload } from "@/app/hooks/Usefileupload";
import { usePipeline } from "@/app/hooks/usePipeline";
import { useRealtimePipeline } from "./hooks/useRealtimePipeline";
import { SmartAlert } from "./components/SmartAlert";
import { useGraph } from "./context/GraphContext";
import { usePipelineEvents } from "./context/PipelineContext";
type AlertType = "success" | "error" | "warning" | "info";
export default function Home() {
  const { files, addFiles, removeFile, clearFiles, updateFile } = useFileUpload();

  const { startPipeline } = useRealtimePipeline()
  const [errorMsg, setErrorMsg] = useState<string>("");
  const {
  addEvent , setEvents
} = usePipelineEvents()
  const [errorType, setErrorType] = useState<AlertType>("info");
  const [showAlert, setShowAlert] = useState(false);
  const {
    nodes,
    edges,
    setEdges,
    setNodes,
  } = useGraph();

  const showToast = useCallback((msg: string) => {
    setErrorMsg(msg)

  }, []);

  const onPipelineComplete = useCallback(() => {
    showToast(`KG built · GraphXR synced · ${files.length || 1} doc(s) processed · 787 paths loaded`);
  }, [files.length, showToast]);

  const { steps, running, start, reset } = usePipeline(onPipelineComplete);


  useEffect(() => {

    const timer = setTimeout(() => {
      setShowAlert(false)
    }, 5000);

    return () => {
      clearTimeout(timer)
    }

  }, [showAlert])

  const handleRun = async () => {


    setEvents([])
    // Mark all files as processing

    if (!files.length) {
      setShowAlert(true)

      setErrorMsg("Upload atleast one file")
      return
    }



    // start()

    for (const f of files) {

      updateFile(
        f.id,
        {
          status: "processing",
          progress: 10,
        }

      )




      await startPipeline(
        f.file,
        (event) => {
          console.log(`ado ${event.type}}`)
          addEvent(event)
        

          if (event.type === "pipeline_completed") {
            updateFile(
              f.id,
              {
                status: "done",
                progress: 100,
              }
            )
          }

          if (
            event.type === "chunk_processing"
          ) {

            showToast(
              event.message
            )
          }

        }
      )
    }


    /*


    const nodes_from_server = [

      {
        id: "n1",
        type: "Country",
        name: "Japan",
        uid: "country_001",
      },
      {
        id: "n2",
        type: "Country",
        name: "Germany",
        uid: "country_002",
      },
      {
        id: "n3",
        type: "Country",
        name: "Australia",
        uid: "country_003",
      },


      {
        id: "n4",
        type: "City",
        name: "Tokyo",
        uid: "city_001",
      },
      {
        id: "n5",
        type: "City",
        name: "Berlin",
        uid: "city_002",
      },
      {
        id: "n6",
        type: "City",
        name: "Melbourne",
        uid: "city_003",
      },


      {
        id: "n7",
        type: "University",
        name: "University of Tokyo",
        uid: "uni_001",
      },
      {
        id: "n8",
        type: "University",
        name: "TU Berlin",
        uid: "uni_002",
      },
      {
        id: "n9",
        type: "University",
        name: "Monash University",
        uid: "uni_003",
      },

   
      {
        id: "n10",
        type: "Student",
        name: "Emma",
        uid: "student_001",
      },
      {
        id: "n11",
        type: "Student",
        name: "Liam",
        uid: "student_002",
      },
      {
        id: "n12",
        type: "Student",
        name: "Sofia",
        uid: "student_003",
      },


      {
        id: "n13",
        type: "Course",
        name: "Machine Learning",
        uid: "course_001",
      },
      {
        id: "n14",
        type: "Course",
        name: "Cyber Security",
        uid: "course_002",
      },
      {
        id: "n15",
        type: "Course",
        name: "Data Structures",
        uid: "course_003",
      },

      {
        id: "n16",
        type: "Company",
        name: "Google",
        uid: "company_001",
      },
      {
        id: "n17",
        type: "Company",
        name: "Microsoft",
        uid: "company_002",
      },

    
      {
        id: "n18",
        type: "Technology",
        name: "React",
        uid: "tech_001",
      },
      {
        id: "n19",
        type: "Technology",
        name: "TypeScript",
        uid: "tech_002",
      },
      {
        id: "n20",
        type: "Technology",
        name: "Docker",
        uid: "tech_003",
      },
    

    setNodes(nodes_from_server.map((d) => ({
      ...d,
      x: 0,
      y: 0
    })))

    setEdges([
  
      {
        id: "e1",
        source: "n1",
        target: "n4",
        rel: "HAS_CITY",
      },
      {
        id: "e2",
        source: "n2",
        target: "n5",
        rel: "HAS_CITY",
      },
      {
        id: "e3",
        source: "n3",
        target: "n6",
        rel: "HAS_CITY",
      },

   
      {
        id: "e4",
        source: "n4",
        target: "n7",
        rel: "LOCATED_IN",
      },
      {
        id: "e5",
        source: "n5",
        target: "n8",
        rel: "LOCATED_IN",
      },
      {
        id: "e6",
        source: "n6",
        target: "n9",
        rel: "LOCATED_IN",
      },


      {
        id: "e7",
        source: "n10",
        target: "n9",
        rel: "STUDIES_AT",
      },
      {
        id: "e8",
        source: "n11",
        target: "n7",
        rel: "STUDIES_AT",
      },
      {
        id: "e9",
        source: "n12",
        target: "n8",
        rel: "STUDIES_AT",
      },

      {
        id: "e10",
        source: "n10",
        target: "n13",
        rel: "ENROLLED_IN",
      },
      {
        id: "e11",
        source: "n11",
        target: "n14",
        rel: "ENROLLED_IN",
      },
      {
        id: "e12",
        source: "n12",
        target: "n15",
        rel: "ENROLLED_IN",
      },


      {
        id: "e13",
        source: "n16",
        target: "n18",
        rel: "USES",
      },
      {
        id: "e14",
        source: "n16",
        target: "n19",
        rel: "USES",
      },
      {
        id: "e15",
        source: "n17",
        target: "n20",
        rel: "USES",
   
      {
        id: "e16",
        source: "n10",
        target: "n18",
        rel: "LEARNS",
      },
      {
        id: "e17",
        source: "n11",
        target: "n19",
        rel: "LEARNS",
      },
      {
        id: "e18",
        source: "n12",
        target: "n20",
        rel: "LEARNS",
      },

      {
        id: "e19",
        source: "n16",
        target: "n10",
        rel: "HIRES",
      },
      {
        id: "e20",
        source: "n17",
        target: "n12",
        rel: "HIRES",
      },
    ])

    */
    //start();
  };

  const handleClear = () => {
    clearFiles();
    setEdges([])
    setNodes([])
    
    setEvents([])

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

      <SmartAlert open={showAlert} type={errorType} title={errorMsg} onClose={() => setShowAlert(false)} />
    </div>
  );
}