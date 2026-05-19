from pydantic import BaseModel
import os
from dotenv import load_dotenv



class Settings(BaseModel):
    
    load_dotenv()
    app_name: str  = "GraphPilot Server"
    ollama_host: str = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
    qwen_model: str = os.getenv("QWEN_MODEL", "qwen3.6:27b")
    mistral_model: str = os.getenv("MISTRAL_MODEL", "mistral-small:24b")
    gpt_model: str =  os.getenv(
    "GPT_MODEL",
    "gpt-4.1-mini"
)
    embed_model: str = os.getenv("EMBED_MODEL", "nomic-embed-text")

    neo4j_uri: str = os.getenv("NEO4J_URI", "")
    neo4j_user: str = os.getenv("NEO4J_USER", "")
    neo4j_pass: str = os.getenv("NEO4J_PASS", "")

    upload_dir: str = os.getenv("UPLOAD_DIR", "./uploads")
    max_chars: int = int(os.getenv("MAX_CHARS", "1800"))
    overlap_sents: int = int(os.getenv("OVERLAP_SENTS", "2"))
    openai_api_key : str =  os.getenv("OPEN_API_KEY", "")


settings = Settings()