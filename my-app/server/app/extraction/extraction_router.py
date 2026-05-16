import os
import uuid
import asyncio
from fastapi import Form

from fastapi import (
    APIRouter , 
    UploadFile,
    File
)


from app.config import  settings


from app.schemas import UploadResponse
from app.services.pipeline_service import process_pdf_job
from app.services.event_emitter import emit_event


router = APIRouter(
    prefix="/api",
    tags=["extraction"]
)




@router.post("/extract" , response_model=UploadResponse)
async def extract_pdf(job_id : str=  Form(...) ,file :UploadFile = File(...)  ):
    os.makedirs(settings.upload_dir , exist_ok=True)

   

    save_path  =  os.path.join(
        settings.upload_dir,
        f"{job_id}_{file.filename}"
    )

    content  = await file.read()

    with open(save_path , "wb") as f:
        f.write(content)


    #stream as pdf uplaoded
    await emit_event(
        job_id,
        "pdf_uploaded",
        "PDF uploaded",
        {
            "filename": file.filename
        }
    )

    #add the main execution to the asynico task

    asyncio.create_task(
        process_pdf_job(
            job_id=job_id , 
            pdf_path= save_path
        )
    )

    return UploadResponse(
        job_id=job_id
    )




