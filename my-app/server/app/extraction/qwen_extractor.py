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
    chunk_id="chunk_001",

    entities=[
        EntityItem(name="Emma", label="Student"),
        EntityItem(name="Liam", label="Student"),
        EntityItem(name="Sophia", label="Student"),
        EntityItem(name="Noah", label="Student"),
        EntityItem(name="Ava", label="Student"),
        EntityItem(name="Ethan", label="Student"),

        EntityItem(name="Monash University", label="University"),
        EntityItem(name="Swinburne University", label="University"),
        EntityItem(name="RMIT University", label="University"),
        EntityItem(name="University of Melbourne", label="University"),

        EntityItem(name="Melbourne", label="City"),
        EntityItem(name="Sydney", label="City"),
        EntityItem(name="Brisbane", label="City"),

        EntityItem(name="Machine Learning", label="Course"),
        EntityItem(name="Data Science", label="Course"),
        EntityItem(name="Software Engineering", label="Course"),
        EntityItem(name="Cloud Computing", label="Course"),
        EntityItem(name="Cybersecurity", label="Course"),
        EntityItem(name="Database Systems", label="Course"),

        EntityItem(name="Google", label="Company"),
        EntityItem(name="Microsoft", label="Company"),
        EntityItem(name="Atlassian", label="Company"),
        EntityItem(name="Amazon Web Services", label="Company"),
        EntityItem(name="Canva", label="Company"),
        EntityItem(name="IBM", label="Company"),

        EntityItem(name="React", label="Technology"),
        EntityItem(name="TypeScript", label="Technology"),
        EntityItem(name="Python", label="Technology"),
        EntityItem(name="Neo4j", label="Technology"),
        EntityItem(name="FastAPI", label="Technology"),
        EntityItem(name="Next.js", label="Technology"),
        EntityItem(name="Docker", label="Technology"),
        EntityItem(name="Kubernetes", label="Technology"),
        EntityItem(name="PostgreSQL", label="Technology"),
        EntityItem(name="MongoDB", label="Technology"),
        EntityItem(name="TensorFlow", label="Technology"),
        EntityItem(name="PyTorch", label="Technology"),
        EntityItem(name="AWS", label="Technology"),
        EntityItem(name="Azure", label="Technology"),
        EntityItem(name="GitHub", label="Technology"),
    ],

    relations=[
        RelationItem(head="Emma", relation="STUDIES_AT", tail="Monash University"),
        RelationItem(head="Liam", relation="STUDIES_AT", tail="Monash University"),
        RelationItem(head="Sophia", relation="STUDIES_AT", tail="Swinburne University"),
        RelationItem(head="Noah", relation="STUDIES_AT", tail="RMIT University"),
        RelationItem(head="Ava", relation="STUDIES_AT", tail="University of Melbourne"),
        RelationItem(head="Ethan", relation="STUDIES_AT", tail="Swinburne University"),

        RelationItem(head="Monash University", relation="LOCATED_IN", tail="Melbourne"),
        RelationItem(head="Swinburne University", relation="LOCATED_IN", tail="Melbourne"),
        RelationItem(head="RMIT University", relation="LOCATED_IN", tail="Melbourne"),
        RelationItem(head="University of Melbourne", relation="LOCATED_IN", tail="Melbourne"),

        RelationItem(head="Google", relation="LOCATED_IN", tail="Sydney"),
        RelationItem(head="Microsoft", relation="LOCATED_IN", tail="Sydney"),
        RelationItem(head="Atlassian", relation="LOCATED_IN", tail="Sydney"),
        RelationItem(head="Amazon Web Services", relation="LOCATED_IN", tail="Brisbane"),
        RelationItem(head="Canva", relation="LOCATED_IN", tail="Sydney"),
        RelationItem(head="IBM", relation="LOCATED_IN", tail="Melbourne"),

        RelationItem(head="Emma", relation="ENROLLED_IN", tail="Machine Learning"),
        RelationItem(head="Emma", relation="ENROLLED_IN", tail="Data Science"),
        RelationItem(head="Emma", relation="ENROLLED_IN", tail="Database Systems"),

        RelationItem(head="Liam", relation="ENROLLED_IN", tail="Software Engineering"),
        RelationItem(head="Liam", relation="ENROLLED_IN", tail="Cloud Computing"),
        RelationItem(head="Liam", relation="ENROLLED_IN", tail="Cybersecurity"),

        RelationItem(head="Sophia", relation="ENROLLED_IN", tail="Cloud Computing"),
        RelationItem(head="Sophia", relation="ENROLLED_IN", tail="Data Science"),
        RelationItem(head="Sophia", relation="ENROLLED_IN", tail="Machine Learning"),

        RelationItem(head="Noah", relation="ENROLLED_IN", tail="Software Engineering"),
        RelationItem(head="Noah", relation="ENROLLED_IN", tail="Database Systems"),
        RelationItem(head="Noah", relation="ENROLLED_IN", tail="Cybersecurity"),

        RelationItem(head="Ava", relation="ENROLLED_IN", tail="Machine Learning"),
        RelationItem(head="Ava", relation="ENROLLED_IN", tail="Cloud Computing"),
        RelationItem(head="Ava", relation="ENROLLED_IN", tail="Data Science"),

        RelationItem(head="Ethan", relation="ENROLLED_IN", tail="Software Engineering"),
        RelationItem(head="Ethan", relation="ENROLLED_IN", tail="Database Systems"),
        RelationItem(head="Ethan", relation="ENROLLED_IN", tail="Cloud Computing"),

        RelationItem(head="Machine Learning", relation="USES", tail="Python"),
        RelationItem(head="Machine Learning", relation="USES", tail="TensorFlow"),
        RelationItem(head="Machine Learning", relation="USES", tail="PyTorch"),
        RelationItem(head="Machine Learning", relation="USES", tail="GitHub"),

        RelationItem(head="Data Science", relation="USES", tail="Python"),
        RelationItem(head="Data Science", relation="USES", tail="PostgreSQL"),
        RelationItem(head="Data Science", relation="USES", tail="MongoDB"),
        RelationItem(head="Data Science", relation="USES", tail="GitHub"),

        RelationItem(head="Software Engineering", relation="USES", tail="React"),
        RelationItem(head="Software Engineering", relation="USES", tail="TypeScript"),
        RelationItem(head="Software Engineering", relation="USES", tail="Next.js"),
        RelationItem(head="Software Engineering", relation="USES", tail="Docker"),

        RelationItem(head="Cloud Computing", relation="USES", tail="AWS"),
        RelationItem(head="Cloud Computing", relation="USES", tail="Azure"),
        RelationItem(head="Cloud Computing", relation="USES", tail="Docker"),
        RelationItem(head="Cloud Computing", relation="USES", tail="Kubernetes"),

        RelationItem(head="Cybersecurity", relation="USES", tail="Python"),
        RelationItem(head="Cybersecurity", relation="USES", tail="Docker"),
        RelationItem(head="Cybersecurity", relation="USES", tail="GitHub"),

        RelationItem(head="Database Systems", relation="USES", tail="Neo4j"),
        RelationItem(head="Database Systems", relation="USES", tail="PostgreSQL"),
        RelationItem(head="Database Systems", relation="USES", tail="MongoDB"),
        RelationItem(head="Database Systems", relation="USES", tail="FastAPI"),

        RelationItem(head="Google", relation="USES", tail="React"),
        RelationItem(head="Google", relation="USES", tail="TypeScript"),
        RelationItem(head="Google", relation="USES", tail="Python"),
        RelationItem(head="Google", relation="USES", tail="Kubernetes"),

        RelationItem(head="Microsoft", relation="USES", tail="TypeScript"),
        RelationItem(head="Microsoft", relation="USES", tail="Azure"),
        RelationItem(head="Microsoft", relation="USES", tail="Python"),
        RelationItem(head="Microsoft", relation="USES", tail="GitHub"),

        RelationItem(head="Atlassian", relation="USES", tail="React"),
        RelationItem(head="Atlassian", relation="USES", tail="Next.js"),
        RelationItem(head="Atlassian", relation="USES", tail="TypeScript"),
        RelationItem(head="Atlassian", relation="USES", tail="PostgreSQL"),

        RelationItem(head="Amazon Web Services", relation="USES", tail="AWS"),
        RelationItem(head="Amazon Web Services", relation="USES", tail="Docker"),
        RelationItem(head="Amazon Web Services", relation="USES", tail="Kubernetes"),
        RelationItem(head="Amazon Web Services", relation="USES", tail="Python"),

        RelationItem(head="Canva", relation="USES", tail="React"),
        RelationItem(head="Canva", relation="USES", tail="TypeScript"),
        RelationItem(head="Canva", relation="USES", tail="Next.js"),
        RelationItem(head="Canva", relation="USES", tail="AWS"),

        RelationItem(head="IBM", relation="USES", tail="Python"),
        RelationItem(head="IBM", relation="USES", tail="Neo4j"),
        RelationItem(head="IBM", relation="USES", tail="Docker"),
        RelationItem(head="IBM", relation="USES", tail="Kubernetes"),

        RelationItem(head="Emma", relation="INTERESTED_IN", tail="Google"),
        RelationItem(head="Emma", relation="INTERESTED_IN", tail="Canva"),
        RelationItem(head="Liam", relation="INTERESTED_IN", tail="Atlassian"),
        RelationItem(head="Liam", relation="INTERESTED_IN", tail="Amazon Web Services"),
        RelationItem(head="Sophia", relation="INTERESTED_IN", tail="Microsoft"),
        RelationItem(head="Sophia", relation="INTERESTED_IN", tail="IBM"),
        RelationItem(head="Noah", relation="INTERESTED_IN", tail="Atlassian"),
        RelationItem(head="Noah", relation="INTERESTED_IN", tail="Google"),
        RelationItem(head="Ava", relation="INTERESTED_IN", tail="Microsoft"),
        RelationItem(head="Ava", relation="INTERESTED_IN", tail="Canva"),
        RelationItem(head="Ethan", relation="INTERESTED_IN", tail="Amazon Web Services"),
        RelationItem(head="Ethan", relation="INTERESTED_IN", tail="IBM"),

        RelationItem(head="React", relation="RELATED_TO", tail="TypeScript"),
        RelationItem(head="React", relation="RELATED_TO", tail="Next.js"),
        RelationItem(head="Next.js", relation="RELATED_TO", tail="TypeScript"),
        RelationItem(head="FastAPI", relation="RELATED_TO", tail="Python"),
        RelationItem(head="Neo4j", relation="RELATED_TO", tail="Database Systems"),
        RelationItem(head="Docker", relation="RELATED_TO", tail="Kubernetes"),
        RelationItem(head="AWS", relation="RELATED_TO", tail="Cloud Computing"),
        RelationItem(head="Azure", relation="RELATED_TO", tail="Cloud Computing"),
        RelationItem(head="TensorFlow", relation="RELATED_TO", tail="Machine Learning"),
        RelationItem(head="PyTorch", relation="RELATED_TO", tail="Machine Learning"),
        RelationItem(head="PostgreSQL", relation="RELATED_TO", tail="Database Systems"),
        RelationItem(head="MongoDB", relation="RELATED_TO", tail="Database Systems"),
    ]
)