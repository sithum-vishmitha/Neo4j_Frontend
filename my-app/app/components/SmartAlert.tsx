"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
} from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface SmartAlertProps {
  open: boolean;
  type?: AlertType;
  title: string;
  message?: string;
  onClose?: () => void;
}

export function SmartAlert({
  open,
  type = "info",
  title,
  message,
  onClose,
}: SmartAlertProps) {
  const variants = {
    success: {
      icon: <CheckCircle2 size={18} />,
      border: "border-emerald-400/25",
      bg: "bg-emerald-400/10",
      iconBg: "bg-emerald-400/15",
      text: "text-emerald-300",
      glow: "shadow-[0_0_40px_rgba(52,211,153,0.15)]",
    },

    error: {
      icon: <XCircle size={18} />,
      border: "border-red-400/25",
      bg: "bg-red-400/10",
      iconBg: "bg-red-400/15",
      text: "text-red-300",
      glow: "shadow-[0_0_40px_rgba(248,113,113,0.15)]",
    },

    warning: {
      icon: <AlertTriangle size={18} />,
      border: "border-amber-400/25",
      bg: "bg-amber-400/10",
      iconBg: "bg-amber-400/15",
      text: "text-amber-300",
      glow: "shadow-[0_0_40px_rgba(251,191,36,0.15)]",
    },

    info: {
      icon: <Info size={18} />,
      border: "border-cyan-400/25",
      bg: "bg-cyan-400/10",
      iconBg: "bg-cyan-400/15",
      text: "text-cyan-300",
      glow: "shadow-[0_0_40px_rgba(34,211,238,0.15)]",
    },
  };

  const style = variants[type];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className={`
            fixed left-6 bottom-6 z-[9999]
            w-[380px] overflow-hidden rounded-2xl border
            backdrop-blur-xl
            ${style.border}
            ${style.bg}
            ${style.glow}
          `}
        >
          {/* Glow Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_60%)]" />

          {/* Content */}
          <div className="relative flex items-start gap-4 p-5">
            
            {/* Icon */}
            <div
              className={`
                flex h-11 w-11 flex-shrink-0 items-center justify-center
                rounded-xl border border-white/10
                ${style.iconBg}
                ${style.text}
              `}
            >
              {style.icon}
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold tracking-[0.04em] text-white">
                {title}
              </h3>

              {message && (
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {message}
                </p>
              )}
            </div>

            {/* Close */}
            {onClose && (
              <button
                onClick={onClose}
                className="
                  flex h-8 w-8 items-center justify-center rounded-lg
                  text-slate-400 transition-all duration-200
                  hover:bg-white/5 hover:text-white
                "
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Bottom Accent Line */}
          <div
            className={`
              h-[2px] w-full
              ${
                type === "success"
                  ? "bg-emerald-300"
                  : type === "error"
                  ? "bg-red-300"
                  : type === "warning"
                  ? "bg-amber-300"
                  : "bg-cyan-300"
              }
            `}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}