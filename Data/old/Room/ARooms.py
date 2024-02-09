import json
from fastapi import HTTPException, WebSocket, WebSocketDisconnect
from fastapi.routing import APIRouter

from Data.old.Room import DRooms
from Api.WSManager import ConnectionManager

RoomsRouter = APIRouter()
RoomsRouter.prefix = "/rooms"


def get_all_rooms():
    # tmp = []
    # for key in DRooms.players_in_rooms.keys():
    #     tmp.append(key)
    # return tmp
    return DRooms.rooms


@RoomsRouter.post("/create_room")
async def create_room(
        room: str,
        max_players: int
):
    if room in DRooms.rooms.keys():
        raise HTTPException(status_code=500, detail="Комната уже существует")
    DRooms.rooms[room] = {
        "players": list(),
        "count_players": max_players,
        "ready_players": list(),
        "woman_players": list()
    }
    await websocket_endpoint(False)
    return DRooms.rooms[room]


@RoomsRouter.delete("/delete_room")
async def delete_room(
        room: str
):
    if room in DRooms.rooms and DRooms.rooms[room]["players"] == []:
        del DRooms.rooms[room]
    else:
        raise HTTPException(status_code=500, detail="Комнаты не существет")
    await websocket_endpoint(False)


@RoomsRouter.post("/in_room")
def in_room(
        room: str,
        nickname: str
):
    for r in DRooms.rooms.keys():
        if nickname in DRooms.rooms[r]["players"]:
            raise HTTPException(status_code=500, detail="Игрок уже в комнате")
    if DRooms.rooms[room]["count_players"] <= len(DRooms.rooms[room]["players"]):
        raise HTTPException(status_code=500, detail="Максимум игроков!")
    DRooms.rooms[room]["players"].append(nickname)
    return {"room": DRooms.rooms[room], "name": room}


@RoomsRouter.get("/lol")
async def lol():
    await create_room("lol", 2)
    in_room("lol", "lol")
    await websocket_endpoint()


manager = ConnectionManager()


@RoomsRouter.websocket("/rooms")
async def websocket_endpoint(websocket: WebSocket or bool):
    if type(websocket) is bool:
        await manager.broadcast(json.dumps(get_all_rooms()))
        return
    await manager.connect(websocket)
    try:
        while True:
            await manager.send_personal_message(json.dumps(get_all_rooms()), websocket)
            await websocket.receive_json()

            await manager.broadcast(json.dumps(get_all_rooms()))
    except WebSocketDisconnect:
        manager.disconnect(websocket)





 # PRIMER

# async def websocket_endpoint(websocket: WebSocket or bool):
#     if type(websocket) is not bool:
#         await manager.connect(websocket)
#     try:
#         while True:
#             # await print(websocket)
#             # data = json.dumps(get_all_rooms())
#             if type(websocket) is not bool:
#                 await manager.send_personal_message(json.dumps(get_all_rooms()), websocket)
#                 data = await websocket.receive_json()
#                 data = json.loads(data)
#                 data = Message(data)
#                 if data.event == "roomIn":
#                     in_room(data.data["room"], data.data["name"])
#                     await manager.send_personal_message(data.data["room"], websocket)
#                 elif data.event == "create":
#                     create_room(data.data["name"], data.data["max"])
#                 elif data.event == "delete":
#                     delete_room(data.data["room"])
#                 await manager.broadcast(json.dumps(get_all_rooms()))
#             else:
#                 create_room("lol", 2)
#                 in_room("lol", "lol")
#                 await manager.broadcast(json.dumps(get_all_rooms()))
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
