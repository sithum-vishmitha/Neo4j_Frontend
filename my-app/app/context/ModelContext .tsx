"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

/* =========================
   Model Type
========================= */

export type ModelLabel = "qwen" | "mistral" | "gpt";

/* =========================
   Context Type
========================= */

interface ModelContextType {
  selected: ModelLabel;
  setSelected: React.Dispatch<React.SetStateAction<ModelLabel>>;
}

/* =========================
   Context
========================= */

const ModelContext = createContext<ModelContextType | null>(null);

/* =========================
   Provider
========================= */

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ModelLabel>("qwen");

  return (
    <ModelContext.Provider value={{ selected, setSelected }}>
      {children}
    </ModelContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useModel() {
  const context = useContext(ModelContext);

  if (!context) {
    throw new Error("useModel must be used inside ModelProvider");
  }

  return context;
}
