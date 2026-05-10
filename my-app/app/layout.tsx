import type { Metadata } from "next";
import "./globals.css";
import { GraphProvider } from "./context/GraphContext";

export const metadata: Metadata = {
  title: "GraphPilot — Neo4j + GraphXR Pipeline",
  description: "Upload PDFs, build Knowledge Graphs, visualise in GraphXR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <GraphProvider>
          {children}
        </GraphProvider>
        

      </body>
    </html>
  );
}