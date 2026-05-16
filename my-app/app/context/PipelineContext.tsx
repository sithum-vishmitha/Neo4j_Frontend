"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

/* =========================
   Event Types
========================= */

export interface PipelineEvent {

  job_id: string

  type: string

  message: string

  ts?: number

  data?: Record<string, any>
}

/* =========================
   Context Type
========================= */

interface PipelineEventContextType {

  events: PipelineEvent[]

  setEvents: React.Dispatch<
    React.SetStateAction<PipelineEvent[]>
  >

  addEvent: (
    event: PipelineEvent
  ) => void

  clearEvents: () => void
}

/* =========================
   Context
========================= */

const PipelineEventContext =
  createContext<
    PipelineEventContextType | null
  >(null)

/* =========================
   Provider
========================= */

export function PipelineEventProvider({
  children
}: { 
  children: ReactNode 
}) {

  const [events, setEvents] =
    useState<PipelineEvent[]>([])

  /* -------------------------
     Add Event
  ------------------------- */

  const addEvent = (
    event: PipelineEvent
  ) => {

    setEvents((prev) => [

      ...prev,

      event
    ])
  }

  /* -------------------------
     Clear Events
  ------------------------- */

  const clearEvents = () => {

    setEvents([])
  }

  return (

    <PipelineEventContext.Provider
      value={{

        events,

        setEvents,

        addEvent,

        clearEvents,
      }}
    >

      {children}

    </PipelineEventContext.Provider>
  )
}

/* =========================
   Hook
========================= */

export function usePipelineEvents() {

  const context = useContext(
    PipelineEventContext
  )

  if (!context) {

    throw new Error(
      "usePipelineEvents must be used inside PipelineEventProvider"
    )
  }

  return context
}