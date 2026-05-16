import fitz
import re
from app.services.event_emitter import emit_event


def clean_text(text  :str)->str:
    text = re.sub(r"[ \t]+", " " , text)
    text = re.sub(r"\n+" , "\n", text)
    return text.strip()



async def extract_pdf_text(job_id  : str , pdf_path : str)->str:
 await emit_event(job_id=job_id , event_type="pdf_started" , message= "Reading_started")
 pages  = []
 doc = fitz.open(pdf_path)
 try :
    for i, page in enumerate(doc):
       page_text  =  page.get_text("text")  or ""
       pages.append(page_text)
       await emit_event(
          job_id=job_id , event_type="pdf_page_extracted" , message=  f"Extracted page {i + 1}",  data= {"page": i + 1, "characters": len(page_text)}
       )
 finally:
    doc.close()


 
 raw_text = clean_text("\n".join(pages))
 await emit_event(
    job_id= job_id , 
    event_type= "pdf_completed" , message= "PDF text extraction completed",  data={"characters": len(raw_text), "pages": len(pages)}
 )

 return raw_text



    






