import json

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocket
from Api.WSManager import ConnectionManager

from Docs.Doc import sub_app

app = FastAPI(docs_url=None, redoc_url=None, title="Web ACS", openapi_url="/api/openapi.json")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()


@app.websocket("/all")
async def websocket_endpoint_lobby(websocket: WebSocket or None, name: str):
    await manager.connect(websocket)
    try:
        while True:
            await manager.send_personal_message('', websocket)

            await manager.broadcast(json.dumps(''))
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# @app.websocket("/ws/{client_id}")
# async def websocket_endpoint(websocket: WebSocket, client_id: int):
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             await manager.send_personal_message(f"You wrote: {data}", websocket)
#             await manager.broadcast(f"Client #{client_id} says: {data}")
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#         await manager.broadcast(f"Client #{client_id} left the chat")


app.mount("/api/docs", sub_app)
