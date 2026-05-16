"use client";
import type { PipelineStep } from "@/app/types";
import { usePipelineEvents } from "@/app/context/PipelineContext";

interface PipelineFlowProps {
  steps: PipelineStep[];
}

const Circle = () => {
  
return (
  <div
    className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
    style={{
      width: 30,
      height: 30,

      border:
        "1.5px solid var(--cyan)",

      background:
        "rgba(0,255,255,0.08)",

      color:
        "var(--cyan)",

      boxShadow:
        "0 0 12px rgba(0,255,255,0.3)",

      animation:
        "spin 1.2s linear infinite",
    }}
  >
    ◌
  </div>
)


}






const Tick =() => {

  return (
      <div
    className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
    style={{
      width: 30,
      height: 30,

      border:
        "1.5px solid var(--teal)",

      background:
        "rgba(0,255,200,0.08)",

      color:
        "var(--teal)",
    }}
  >
    ✓
  </div>
  )

} 




const stepIcon: Record<string, string> = {
  "PDF Ingestion": "↑",
  "NLP Entity Extraction": "⬡",
  "Graph Construction": "⬢",
  "Neo4j Write": "⏚",
  "GraphXR Sync": "◈",
};

const statusColor = {
  idle: "var(--border)",
  active: "var(--cyan)",
  done: "var(--teal)",
  error: "var(--coral)",
};

const statusBg = {
  idle: "transparent",
  active: "var(--cyan-dim)",
  done: "var(--teal-dim)",
  error: "var(--coral-dim)",
};

export function PipelineFlow({ steps }: PipelineFlowProps) {
  const {
  events
} = usePipelineEvents()

const eventTypes =
  events.map((d) => d.type)

console.warn(eventTypes)
  return (
    <div className="flex flex-col text-white">
      <p>Live status  {events[events.length-1]?.message}</p>

      {/* =======================================
      STEP 1
  ======================================= */}

      <div
        className="flex gap-3 relative pb-4"
      >

        {/* Line */}

        <div
          className="absolute left-[14px] top-[30px] bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, var(--teal), var(--border))",
          }}
        />

     
        {
          eventTypes.includes("pdf_completed") ?
            (<Tick />) : (
              <Circle />


            )
        }

        {/* Info */}

        <div className="flex-1 pt-1">

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            PDF Ingestion
          </div>

          <div
            style={{
              fontFamily:
                "var(--font-mono)",

              fontSize: 10,

              color:
                "var(--text-muted)",

              marginTop: 2,

              lineHeight: 1.5,
            }}
          >
            Extract text, tables & figures
          </div>

          {/* Progress */}

          <div
            className="mt-2 h-0.5 rounded-full overflow-hidden"
            style={{
              background:
                "var(--border)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "100%",

                background:
                  "var(--teal)",
              }}
            />
          </div>

        </div>

      </div>

      {/* =======================================
      STEP 2
  ======================================= */}

      <div
        className="flex gap-3 relative pb-4"
      >

        {/* Line */}

        <div
          className="absolute left-[14px] top-[30px] bottom-0 w-px"
          style={{
            background:
              "var(--border)",
          }}
        />

       
        {
          1 ?
            (<Tick />) : (
              <Circle />


            )
        }



        {/* Info */}

        <div className="flex-1 pt-1">

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            NLP Entity Extraction
          </div>

          <div
            style={{
              fontFamily:
                "var(--font-mono)",

              fontSize: 10,

              color:
                "var(--text-muted)",

              marginTop: 2,

              lineHeight: 1.5,
            }}
          >
            NER + relation detection via LLM
          </div>

          {/* Progress */}

          <div
            className="mt-2 h-0.5 rounded-full overflow-hidden"
            style={{
              background:
                "var(--border)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "45%",

                background:
                  "linear-gradient(90deg, var(--cyan), var(--teal))",
              }}
            />
          </div>

          <div
            style={{
              fontFamily:
                "var(--font-mono)",

              fontSize: 9,

              color:
                "var(--cyan)",

              marginTop: 3,
            }}
          >
            45%
          </div>

        </div>

      </div>

      {/* =======================================
      STEP 3
  ======================================= */}

      <div
        className="flex gap-3 relative pb-4"
      >

        {/* Line */}

        <div
          className="absolute left-[14px] top-[30px] bottom-0 w-px"
          style={{
            background:
              "var(--border)",
          }}
        />

        {/* Dot */}

        <div
          className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
          style={{
            width: 30,
            height: 30,

            border:
              "1.5px solid var(--border)",

            background:
              "transparent",

            color:
              "var(--text-muted)",
          }}
        >
          ⬢
        </div>

        {/* Info */}

        <div className="flex-1 pt-1">

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color:
                "var(--text-secondary)",
            }}
          >
            Graph Construction
          </div>

          <div
            style={{
              fontFamily:
                "var(--font-mono)",

              fontSize: 10,

              color:
                "var(--text-muted)",

              marginTop: 2,

              lineHeight: 1.5,
            }}
          >
            Map entities → nodes, relations → edges
          </div>

        </div>

      </div>

      {/* =======================================
      STEP 4
  ======================================= */}

      <div
        className="flex gap-3 relative pb-4"
      >

        <div
          className="absolute left-[14px] top-[30px] bottom-0 w-px"
          style={{
            background:
              "var(--border)",
          }}
        />

        <div
          className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
          style={{
            width: 30,
            height: 30,

            border:
              "1.5px solid var(--border)",

            background:
              "transparent",

            color:
              "var(--text-muted)",
          }}
        >
          ⏚
        </div>

        <div className="flex-1 pt-1">

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color:
                "var(--text-secondary)",
            }}
          >
            Neo4j Write
          </div>

          <div
            style={{
              fontFamily:
                "var(--font-mono)",

              fontSize: 10,

              color:
                "var(--text-muted)",

              marginTop: 2,

              lineHeight: 1.5,
            }}
          >
            MERGE nodes + relationships via Cypher
          </div>

        </div>

      </div>

      {/* =======================================
      STEP 5
  ======================================= */}

      <div
        className="flex gap-3 relative"
      >

        <div
          className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-bold"
          style={{
            width: 30,
            height: 30,

            border:
              "1.5px solid var(--border)",

            background:
              "transparent",

            color:
              "var(--text-muted)",
          }}
        >
          ◈
        </div>

        <div className="flex-1 pt-1">

          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color:
                "var(--text-secondary)",
            }}
          >
            GraphXR Sync
          </div>

          <div
            style={{
              fontFamily:
                "var(--font-mono)",

              fontSize: 10,

              color:
                "var(--text-muted)",

              marginTop: 2,

              lineHeight: 1.5,
            }}
          >
            Stream KG to visualisation engine
          </div>

        </div>

      </div>

    </div>
  );
}