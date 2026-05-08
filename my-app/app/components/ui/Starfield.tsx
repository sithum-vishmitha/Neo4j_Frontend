"use client";
import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function Starfield() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.4,
        duration: 2 + Math.random() * 5,
        delay: Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.7,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse-dot"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}