import requests 
import asyncio






import json
from app.config import settings
from app.extraction.prompts import EXTRACTION_PROMPT
from app.extraction.parser import parse_llm_json
import httpx
from openai import AsyncOpenAI
from app.schemas import *



openai_client = AsyncOpenAI(
    api_key=settings.openai_api_key
)


print(openai_client)
async def qwen_chat(prompt: str):

    payload = {
        "model": settings.qwen_model,
        "messages": [
            {
                "role": "system",
                "content": EXTRACTION_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.0,
            "num_ctx": 12000,
            "num_predict": 2048
        }
    }

    async with httpx.AsyncClient(timeout=600) as client:

        response = await client.post(
            f"{settings.ollama_host}/api/chat",
            json=payload
        )

        response.raise_for_status()

        data = response.json()

        return data.get("message", {}).get("content", "")


# -----------------------------
# MISTRAL (OLLAMA)
# -----------------------------
async def ollama_chat(prompt: str):

    payload = {
        "model": settings.mistral_model,
        "messages": [
            {
                "role": "system",
                "content": EXTRACTION_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.0,
            "num_ctx": 12000,
            "num_predict": 2048
        }
    }

    async with httpx.AsyncClient(timeout=600) as client:

        response = await client.post(
            f"{settings.ollama_host}/api/chat",
            json=payload
        )

        response.raise_for_status()

        data = response.json()

        return data.get("message", {}).get("content", "")


# -----------------------------
# OPENAI GPT
# -----------------------------
async def open_ai_chat(prompt: str):

    response = await openai_client.chat.completions.create(
        model=settings.gpt_model,
        messages=[
            {
                "role": "system",
                "content": EXTRACTION_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return response.choices[0].message.content


async def model_swither(model :str , prompt :str):
      print(f"-------------------------------------------------------------This is the model{model}")
      if model == "qwen":
       raw = await  qwen_chat(prompt=prompt)

      elif model == "gpt":
       raw = await  open_ai_chat(prompt=prompt)
 
      else:
       raw = await  ollama_chat(prompt=prompt)

      return raw
   
async def extract_with_llm(chunk_id : str , text : str , model : str ="gpt"):
     raw =await  model_swither(model=model , prompt=text)
     data =  json.loads(raw)

  
     return KGChunkResult(
        **data
     )
   
 