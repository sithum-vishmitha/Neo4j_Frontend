from fastapi import WebSocket
from collections import defaultdict
from typing import DefaultDict , Set
import asyncio


class ConnectionManager:
    def __init__(self):
        self.jobs : DefaultDict[str , Set[WebSocket]] = defaultdict(set)
        self.lock = asyncio.Lock()

    async def connect(self , job_id : str , websocket : WebSocket):
        await websocket.accept()
        async with self.lock:
            self.jobs[job_id].add(websocket)

    async def disconnect(self, job_id: str, websocket: WebSocket):
        async with self.lock:
            if job_id in self.jobs and websocket in self.jobs[job_id]:
                self.jobs[job_id].remove(websocket)
        
            if job_id in self.jobs and not self.jobs[job_id]:
                del self.jobs[job_id]


    async def braodcast(self , job_id : str , payload  :dict):
        async with self.lock:
            targets  = list(self.jobs.get(job_id , set()))
        for ws in targets:
            try:
                await ws.send_json(payload)
            except Exception :
                pass



              
manager = ConnectionManager()