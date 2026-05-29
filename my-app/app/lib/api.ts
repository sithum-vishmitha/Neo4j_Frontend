const API_URL = "http://localhost:8000"
export async function uploadPDF(

    file: File,
    jobId: string,
    model: string

) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append(
        "job_id",
        jobId
    )
    formData.append(
        "model",
        model
    )


    const response = await fetch(
        `${API_URL}/api/extract`,
        {
            method: "POST",
            body: formData,
        }
    )

    if (!response.ok) {
        throw new Error("Upload failed")

    }


    return response.json()





}

export async function clearKnowledgeGraph() {
    const response = await fetch(
        `${API_URL}/api/graph/clear`,
        {
            method: "DELETE",
        }
    )

    if (!response.ok) { 
        throw new Error("Failed to clear grapgh")
    }


    return response.json()


}