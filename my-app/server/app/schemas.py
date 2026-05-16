from pydantic import BaseModel , Field
from typing import List , Dict  , Any , Optional

class UploadResponse(BaseModel):
    job_id : str
    status: str = "started"


class GraphNode(BaseModel):
    id: str
    type: str
    name: str
    uid: str

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    rel: str


class GraphSnapshot(BaseModel):
    nodes   : List[GraphNode] = Field(default_factory=list)
    edges  : List[GraphEdge] = Field(default_factory=List)



class EntityItem(BaseModel):
      name: str
      label: str

class RelationItem(BaseModel):
    head: str
    relation: str
    tail: str

class KGChunkResult(BaseModel):
    chunk_id : str
    entities : List[EntityItem]  =  Field(default_factory=list)
    relations : List[RelationItem]  = Field(default_factory=list)


class StreamEvent(BaseModel):
    job_id: str
    type: str
    message: str
    data: Dict[str, Any] = Field(default_factory=dict)
    ts: float




