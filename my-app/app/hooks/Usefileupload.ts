"use client";
import { useState, useCallback } from "react";
import type { UploadedFile } from "../types";

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const pdfs = Array.from(incoming).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.file.name + f.file.size));
      const fresh = pdfs
        .filter((f) => !existing.has(f.name + f.size))
        .map<UploadedFile>((f) => ({
          id: crypto.randomUUID(),
          file: f,
          status: "queued",
          progress: 0,
        }));
      return [...prev, ...fresh];
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFiles = useCallback(() => setFiles([]), []);

  const updateFile = useCallback((id: string, patch: Partial<UploadedFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  return { files, addFiles, removeFile, clearFiles, updateFile };
}