import type { Metadata } from "next";
import "./globals.css";
import { GraphProvider } from "./context/GraphContext";
import { PipelineEventProvider, usePipelineEvents } from "./context/PipelineContext";
import { ModelProvider } from "./context/ModelContext ";
export const metadata: Metadata = {
  title: "GraphPilot — Neo4j + GraphXR Pipeline",
  description: "Upload PDFs, build Knowledge Graphs, visualise in GraphXR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <PipelineEventProvider>
          <ModelProvider>

            <GraphProvider>
              {children}
            </GraphProvider>
          </ModelProvider>

        </PipelineEventProvider>
      </body>
    </html>
  );
}