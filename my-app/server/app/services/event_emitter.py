import time
from app.services.websocket_manager import  manager


async def emit_event(job_id: str, event_type: str, message: str, data: dict | None = None):
     
     payload = {
        "job_id": job_id,
        "type": event_type,
        "message": message,
        "data": data or {} ,
        "ts": time.time(),
    }
     
     print(payload)

     
     await manager.braodcast(job_id , payload=payload)

     
