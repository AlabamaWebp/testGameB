import json

from fastapi import HTTPException, WebSocket, WebSocketDisconnect
from fastapi.routing import APIRouter
from Data.Room import DRooms
from Data.WSManager import ConnectionManager

RoomsRouter = APIRouter()
RoomsRouter.prefix = "/rooms"


# @RoomsRouter.get("/check_status")
# async def get_rooms():
#     return get_all_rooms()


def get_all_rooms():
    # tmp = []
    # for key in DRooms.players_in_rooms.keys():
    #     tmp.append(key)
    # return tmp
    return DRooms.rooms


# @RoomsRouter.get("/rooms")
# async def get_rooms():
#     return get_all_rooms()


@RoomsRouter.post("/create_room")
async def create_room(
        room: str,
        max_players: int
):
    if room in DRooms.rooms.keys():
        raise HTTPException(status_code=500, detail="Комната уже существует")
    DRooms.rooms[room] = {
        "players": [],
        "count_players": max_players,
        "ready_players": []
    }
    return DRooms.rooms[room]


@RoomsRouter.delete("/delete_room")
async def delete_room(
        room: str
):
    if room in DRooms.rooms and DRooms.rooms[room]["players"] == []:
        del DRooms.rooms[room]
    else:
        raise HTTPException(status_code=500, detail="Комнаты не существет")
    return get_all_rooms()


@RoomsRouter.post("/in_room")
async def in_room(
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


@RoomsRouter.post("/out_room")
async def out_room(
        room: str,
        nickname: str
):
    DRooms.rooms[room]["players"].remove(nickname)
    return get_all_rooms()


manager = ConnectionManager()


@RoomsRouter.websocket("/rooms")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # await print(websocket)
            data = json.dumps(get_all_rooms())
            await manager.send_personal_message(data, websocket)
            data1 = await websocket.receive_text()
            data1 = json.loads(data1)
            print(1)
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        # await manager.broadcast(f"Client #{client_id} left the chat")
