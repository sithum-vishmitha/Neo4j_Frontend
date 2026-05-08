"use client";
import { useRef, useState, useEffect } from "react";
import type { UploadedFile } from "@/app/types";
import { SmartAlert } from "../SmartAlert";
interface UploadZoneProps {
  files: UploadedFile[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
}

type AlertType = "success" | "error" | "warning" | "info";


const statusIcon: Record<UploadedFile["status"], string> = {
  queued: "○",
  processing: "◌",
  done: "✓",
  error: "✕",
};
const statusColor: Record<UploadedFile["status"], string> = {
  queued: "var(--text-secondary)",
  processing: "var(--amber)",
  done: "var(--teal)",
  error: "var(--coral)",
};

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function UploadZone({ files, onAdd, onRemove }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorType, setErrorType] = useState<AlertType>("info");
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);



  const CheckAndAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    for (const file of Array.from(files!)) {
      if (file.type !== "application/pdf") {
        setShowAlert(true)
        setErrorType("warning")
        setErrorMsg("Uplaoded file is not PDF type")
        return

      }
    }

    onAdd(files!);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files

    for (const file of Array.from(files)) {
      if (file.type !== "application/pdf") {
        setShowAlert(true)
        setErrorType("warning")
        setErrorMsg("Uplaoded file is not PDF type")
        return

      }
    }
    setDragging(false);
    onAdd(files);
  };


  return (
    <div className="flex flex-col gap-4">

      {/* Upload Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
        relative flex cursor-pointer select-none flex-col items-center
        justify-center gap-3 overflow-hidden rounded-2xl border
        border-dashed px-6 py-10 text-center transition-all duration-300
        ${dragging
            ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,0.12)]"
            : "border-white/10 bg-[#111927] hover:border-cyan-400/30 hover:bg-[#131D2A]"
          }
      `}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_70%)]" />

        {/* Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(103 232 249)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>

        {/* Main Text */}
        <div className="relative">
          <h3 className="text-sm font-semibold tracking-[0.08em] text-white">
            Drop PDFs here or click to browse
          </h3>

          <p className="mt-1 font-mono text-[11px] tracking-[0.08em] text-slate-300">
            Multiple files supported
          </p>
        </div>

        {/* Badge */}
        <div className="relative mt-1 flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1">
          <span className="text-xs text-amber-300">⬡</span>

          <span className="font-mono text-[10px] tracking-[0.08em] text-amber-200">
            PDF ONLY · MAX 50MB
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="hidden"

          onChange={(e) => e.target.files && CheckAndAddFile(e)}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="flex max-h-60 flex-col gap-2 overflow-y-auto pr-1">

          {/* Header */}
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="font-mono text-[10px] tracking-[0.18em] text-slate-300">
              QUEUED FILES
            </span>

            <span className="font-mono text-[10px] tracking-[0.12em] text-cyan-300">
              {files.length} PDF{files.length !== 1 ? "S" : ""}
            </span>
          </div>

          {files.map((f) => (
            <div
              key={f.id}
              className="
              flex items-center gap-3 rounded-2xl border border-white/10
              bg-[#111927] px-4 py-3 transition-all duration-300
              hover:border-cyan-400/20 hover:bg-[#141F2D]
            "
            >
              {/* PDF Badge */}
              <div className="
              flex h-11 w-11 flex-shrink-0 items-center justify-center
              rounded-xl border border-red-400/20 bg-red-400/10
            ">
                <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-red-300">
                  PDF
                </span>
              </div>

              {/* File Info */}
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-sm font-medium text-white"
                  title={f.file.name}
                >
                  {f.file.name}
                </div>

                <div className="mt-1 font-mono text-[10px] tracking-[0.08em] text-slate-300">
                  {fmt(f.file.size)}
                </div>
              </div>

              {/* Progress */}
              {f.status === "processing" && (
                <div className="w-20 flex-shrink-0">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-300 transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status */}
              <div
                className="flex-shrink-0 text-sm"
                style={{
                  color: statusColor[f.status],
                  animation:
                    f.status === "processing"
                      ? "spin 1.2s linear infinite"
                      : undefined,
                }}
              >
                {statusIcon[f.status]}
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemove(f.id)}
                className="
                flex h-7 w-7 flex-shrink-0 items-center justify-center
                rounded-lg text-slate-400 transition-all duration-300
                hover:bg-red-400/10 hover:text-red-300
              "
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <SmartAlert open={showAlert} type={errorType} title={errorMsg} onClose={() => setShowAlert(false)} />
    </div>
  );
}