const WS_URL = "ws://localhost:8000"
let socket: WebSocket | null = null

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
        const data = JSON.parse(event.data)
    

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