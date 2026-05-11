from pydantic import BaseModel
from typing import List

class KGNode(BaseModel):
    id : str
    type : str 
    name : str


class KGEdge(BaseModel):
    source: str
    target: str
    rel: str


class ExtractionResult(BaseModel):
    nodes: List[KGNode]
    edges: List[KGEdge]