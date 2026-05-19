"use client"

import { useCallback } from "react"

import {
  usePipelineEvents
} from "../context/PipelineContext"

import {
  uploadPDF
} from "../lib/api"

import {
  connectPipelineSocket
} from "../lib/websocket"

import {
  useGraph
} from "../context/GraphContext"


export function useRealtimePipeline() {

  const {
    setEvents
  } = usePipelineEvents()

  const {
    setNodes,
    setEdges,
  } = useGraph()

  const startPipeline = useCallback(

    async (
      file: File,
      onEvent?: (event: any) => void
    ) => {

      // -----------------------------
      // CLEAR OLD STATE
      // -----------------------------

      setEvents([])

      setNodes([])

      setEdges([])
      // -----------------------------------
      // CREATE JOB ID
      // -----------------------------------

      const jobId =
        crypto.randomUUID()

      // -----------------------------------
      // CONNECT WS FIRST
      // -----------------------------------

    await  connectPipelineSocket(

        jobId,

        (event) => {


      


          onEvent?.(event)

          setEvents((prev: any) => [

            ...prev,

            event
          ])

          // -----------------------------
          // GRAPH UPDATE
          // -----------------------------

          if (
            event.type === "graph_update"
          ) {

            const graph =
              event.data

            setNodes(

              graph.nodes.map(
                (n: any) => ({
                  ...n,
                  x: 0,
                  y: 0,
                })
              )
            )

            setEdges(
              graph.edges
            )
          }
        }
      )

      // -----------------------------------
      // SMALL DELAY
      // -----------------------------------


      // -----------------------------------
      // UPLOAD PDF
      // -----------------------------------

      await uploadPDF(
        file,
        jobId
      )
    },

    [
      setNodes,
      setEdges,
      setEvents,
    ]
  )

  return {
    startPipeline
  }
}