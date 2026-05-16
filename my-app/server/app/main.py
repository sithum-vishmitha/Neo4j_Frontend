from fastapi import FastAPI ,  WebSocket , WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.services.neo4j_service import Neo4jService


from app.extraction.extraction_router import router as extraction_router
from app.services.websocket_manager import manager
from app.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware, 
     allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(extraction_router)



@app.get("/health")
async def health():
        return {"status": "ok"}


@app.on_event("startup")
async def startup_event():

    neo4j = Neo4jService()

    connected = neo4j.is_connected()

    if connected:

        print("----------Neo4j connected successfully----------- :-)")

        neo4j.ensure_schema()

    else:

        print("Neo4j connection failed")

        raise Exception(
            "!!!!!!!!!!Neo4j database not reachable!!!!!!!!!:-()"
        )


@app.websocket("/ws/{job_id}")
async def websocket_endpoint(websocket : WebSocket , job_id : str):
        await manager.connect(job_id=job_id , websocket=websocket)

        try : 
                while True :
                        await websocket.receive_text()
        except WebSocketDisconnect:
           await manager.disconnect(job_id=job_id , websocket=websocket)
        
        except Exception :
               await manager.disconnect(job_id=job_id  , websocket=websocket)
                

