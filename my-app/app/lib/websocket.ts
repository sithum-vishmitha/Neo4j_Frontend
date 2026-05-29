const WS_URL = "ws://localhost:8000"
let socket: WebSocket | null = null
import type { PipelineEvent } from "@/app/context/PipelineContext"
export function connectPipelineSocket(
    jobId: string,
    onMessage: (data: any) => void
): Promise<void> {

     return new Promise((resolve, reject) => {

    if (socket) {
        socket.close()
        socket = null
    }

    socket = new WebSocket(
        `${WS_URL}/ws/${jobId}`


    )

    socket.onopen = () => {
        console.log("WS  connected")
         resolve()

    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as PipelineEvent
    

        onMessage(data)
    }

    socket.onerror = (err) => {
        console.error(err)
        reject(err)

    }

    socket.onclose = () => {
        console.log("WS Closed")

    }


     })






}


export function disconnectPipelineSocket() { 
    if (socket)  { 
        socket.close();
        socket = null

        console.log("WS manually disconnected");
    }
}