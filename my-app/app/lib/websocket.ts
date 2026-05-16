const WS_URL = "ws://localhost:8000"
export function connectPipelineSocket(
    jobId: string,
    onMessage: (data: any) => void
) {
    const socket = new WebSocket(
        `${WS_URL}/ws/${jobId}`


    )

    socket.onopen = () => {
        console.log("WS  connected")

    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        onMessage(data)
    }

    socket.onerror = (err) =>{
        console.error(err)

    }

    socket.onclose = () =>{
        console.log("WS Closed")

    }


    return socket






}