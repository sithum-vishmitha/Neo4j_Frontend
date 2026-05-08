"use client";
import { useState, useCallback, useRef } from "react";
import type { PipelineStep, PipelineStepStatus } from "@/app/types";
import { PIPELINE_STEPS } from "@/app/lib/graphData";

function makeSteps(): PipelineStep[] {
  return PIPELINE_STEPS.map((s) => ({ ...s, status: "idle", progress: 0 }));
}

export function usePipeline(onComplete: () => void) {
  const [steps, setSteps] = useState<PipelineStep[]>(makeSteps());
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const setStep = (id: number, patch: Partial<PipelineStep>) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const runStep = useCallback(
    (index: number) => {
      if (index >= PIPELINE_STEPS.length) {
        setRunning(false);
        onComplete();
        return;
      }

      // Mark previous as done
      if (index > 0) setStep(index - 1, { status: "done", progress: 100 });

      setStep(index, { status: "active", progress: 0 });

      let progress = 0;
      const tick = () => {
        progress = Math.min(progress + Math.random() * 9 + 2, 100);
        setStep(index, { progress: Math.round(progress) });
        if (progress < 100) {
          const t = setTimeout(tick, 80 + Math.random() * 40);
          timers.current.push(t);
        } else {
          const t = setTimeout(() => runStep(index + 1), 250);
          timers.current.push(t);
        }
      };
      tick();
    },
    [onComplete]
  );

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    setSteps(makeSteps());
    timers.current.forEach(clearTimeout);
    timers.current = [];
    runStep(0);
  }, [running, runStep]);

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(false);
    setSteps(makeSteps());
  }, []);

  return { steps, running, start, reset };
}