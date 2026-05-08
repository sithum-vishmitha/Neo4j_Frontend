"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  type?: "success" | "info" | "warning";
}

const colors = {
  success: { border: "var(--teal)",  text: "var(--teal)" },
  info:    { border: "var(--cyan)",  text: "var(--cyan)" },
  warning: { border: "var(--amber)", text: "var(--amber)" },
};

export function Toast({ message, show, type = "success" }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 4200);
      return () => clearTimeout(t);
    }
  }, [show]);

  const c = colors[type];

  return (
    <div
      className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 text-sm backdrop-blur-sm transition-all duration-500"
      style={{
        background: "var(--card)",
        border: `1px solid ${c.border}`,
        color: c.text,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        transform: visible ? "translateX(0)" : "translateX(130%)",
        opacity: visible ? 1 : 0,
        maxWidth: 300,
      }}
    >
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}