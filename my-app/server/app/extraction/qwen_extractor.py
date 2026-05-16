import requests 
import asyncio
from app.config import settings
from app.extraction.prompts import EXTRACTION_PROMPT
from app.extraction.parser import parse_llm_json
from app.schemas import *

async def ollama_chat(prompt : str , model:str):
     def  sync_call():
          
          selected_model = (
                settings.qwen_model
            if model == "qwen"
            else settings.mistral_model
          )
          response = requests.post(
               f"{settings.ollama_host}/api/chat",
               json= {
                    "model" : selected_model,
                    "messages" : [
                         {
                              "role" : "system",
                              "content" : EXTRACTION_PROMPT
                         },
                         {
                              "role" : "user" ,
                              "content" : prompt
                         }
                    ],
                     "stream" : False,
                     "think" : False,
                     "format" : "json",
                     "options" : {
                             "temperature": 0.0,
                            "num_ctx": 12000,
                            "num_predict": 2048
                          }

               },
               timeout=600
          )
          response.raise_for_status()
          data =  response.json()
          return data["message"]["content"]
     
     return await asyncio.to_thread(sync_call)

async def extract_with_qwen(chunk_id : str , text : str , model : str):
     #raw = await ollama_chat(text , model)
     return KGChunkResult(
    chunk_id='chunk_001',

    entities=[

        EntityItem(
            name='Emma',
            label='Student'
        ),

        EntityItem(
            name='Monash University',
            label='University'
        ),

        EntityItem(
            name='Melbourne',
            label='City'
        ),

        EntityItem(
            name='Machine Learning',
            label='Course'
        ),

        EntityItem(
            name='Google',
            label='Company'
        ),

        EntityItem(
            name='React',
            label='Technology'
        ),

        EntityItem(
            name='TypeScript',
            label='Technology'
        ),
    ],

    relations=[

        RelationItem(
            head='Emma',
            relation='STUDIES_AT',
            tail='Monash University'
        ),

        RelationItem(
            head='Emma',
            relation='ENROLLED_IN',
            tail='Machine Learning'
        ),

        RelationItem(
            head='Google',
            relation='USES',
            tail='React'
        ),

        RelationItem(
            head='Google',
            relation='USES',
            tail='TypeScript'
        ),
    ]
)