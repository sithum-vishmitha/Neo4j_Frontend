"use client";

import { Database, Network } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070B12]/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-8">

        {/* Left Section */}
        <div className="flex items-center gap-4">

          {/* Logo */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <div className="absolute h-5 w-5 rounded-full bg-cyan-400 blur-md opacity-60" />

            <div className="relative flex h-3 w-3 items-center justify-center rounded-full bg-cyan-300">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-50" />
            </div>
          </div>

          {/* Branding */}
          <div className="flex flex-col">
            <h1 className="text-lg  tracking-[0.18em] text-white">
              GRAPHPILOT
            </h1>

            <p className=" text-[11px] tracking-[0.25em] text-slate-400">
              NEO4J · GRAPHXR ANALYTICS
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {
            0 ?
              (<StatusBadge
                icon={<Database size={14} />}
                label="NEO4J CONNECTED"
                color="cyan"
              />) : (<><StatusBadge
                icon={<Database size={14} />}
                label="NEO4J NOT CONNECTED !"
                color="red"
              />
              </>)

          }


          {
            1 ? (
              <StatusBadge
                icon={<Network size={14} />}
                label="GRAPHXR READY"
                color="violet"
              />

            ) : (<></>)
          }

        </div>
      </div>
    </header>
  );
}

function StatusBadge({
  label,
  icon,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  color: "cyan" | "violet" | "red";
}) {
  const styles = {
    cyan: {
      border:
        "border-cyan-400/30",
      bg: "bg-cyan-400/10",
      text: "text-cyan-300",
      dot: "bg-cyan-300",
      glow: "shadow-[0_0_20px_rgba(34,211,238,0.18)]",
    },

    violet: {
      border:
        "border-violet-400/30",
      bg: "bg-violet-400/10",
      text: "text-violet-300",
      dot: "bg-violet-300",
      glow: "shadow-[0_0_20px_rgba(167,139,250,0.18)]",
    },

    red: {
      border: "border-red-400/30",
      bg: "bg-red-400/10",
      text: "text-red-300",
      dot: "bg-red-300",
      glow: "shadow-[0_0_20px_rgba(248,113,113,0.18)]", // red-400 = rgb(248,113,113)
    },

  };

  const s = styles[color];

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-4 py-2 ${s.border} ${s.bg} ${s.text} ${s.glow}`}
    >
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${s.dot} animate-pulse`} />

        <span className="opacity-90">
          {icon}
        </span>
      </div>

      <span className=" text-[11px] font-medium tracking-[0.12em]">
        {label}
      </span>
    </div>
  );
}