import asyncio
import os
import re
import nltk
from nltk.tokenize import sent_tokenize

from app.config import settings
from app.services.pdf_service import extract_pdf_text
from app.services.neo4j_service import Neo4jService
from app.services.event_emitter import emit_event
from app.extraction.qwen_extractor import extract_with_llm
from app.extraction.normalizer import normalize_result
from app.utils.chunker import (
    split_sentences,
    chunk_by_chars
)


async def process_pdf_job(
        job_id : str ,
        pdf_path : str
):
    

  print("PIPELINE STARTED")


  neo4j = Neo4jService()
  #endure the neo4j service
  neo4j.ensure_schema()
  
  
  try:
    #streamd content about the pipeline start
    await emit_event(
      job_id=job_id,
      event_type= "pipeline_started",
      message= "Pipeline started",
      data={
        "file" : os.path.basename(pdf_path)
      }

    )

    #start the extract from pdf with emitting stram
    text =  await extract_pdf_text(pdf_path=pdf_path , job_id=job_id)
    #split he text to cleared sentences

    sents  = split_sentences(text=text)
    #extract the meaningful chinks with overload usign the nltk
    chunks  = chunk_by_chars(sents=sents ,  max_chars= settings.max_chars , overlap_sents= settings.overlap_sents)

    #create another emitis for the chinking  completed
    await emit_event(job_id= job_id , event_type='chunking_completed' , message= "Chunking completed" , data={
            "chunks": len(chunks)
    } )

    #prcess the chuks
    for idx , chunk in enumerate(chunks):
      chunk_id  = f"{job_id}_chunk{idx+1}"

      #stream the event
      await emit_event(
        job_id=job_id , 
        event_type= "chunk_processing",
        message=  f"Processing chunk {idx+1}/{len(chunks)}",
        data=  {
                    "chunk": idx + 1,
                    "total": len(chunks)
                }

      )

      #get the llm result for this chunk
      result = await extract_with_llm(
        chunk_id=
        chunk_id , text= chunk , model= "gpt"
      )

      #normalise the LLm result 
      result =  normalize_result(result)



      #emit hte event for completiomn of the extraction
      await emit_event(
        job_id= job_id,
        event_type= "extraction_completed",
        message= "Chunk extraction completed",
        data= {
                    "entities": len(result.entities),
                    "relations": len(result.relations)
        }



      )

      #run the neo4j grapgh creation in seperate thread

      await asyncio.to_thread(
        neo4j.upsert_chunk,
        result , 
        job_id,
        chunk_id

      )
      
      #fetch the neo4j graph from on seperate thread
      graph=  await asyncio.to_thread(
        neo4j.fetch_graph
      )

      #stream the current build process

      await emit_event(
        job_id=job_id,
        event_type= "graph_update",
        message= f"Graph updated chunk {idx+1}",
        data = {
          "nodes" : [ 
            n.model_dump() for n in graph.nodes
          ],

          "edges" : [
            e.model_dump() for e  in graph.edges
          ],
           "progress": {
                        "chunk": idx + 1,
                        "total": len(chunks)
                    }
          
        }

      )


    #after process all chunks then stream the final result
    await emit_event(
       job_id=job_id,
       event_type= "pipeline_completed",
       message="Pipeline Completed"
    )

  except Exception as e:
    await emit_event(job_id=job_id , event_type="error" , message= "Pipeline failed" , data=   {
                "error": str(e)
            })
    
  finally:
    neo4j.close()




    
    

