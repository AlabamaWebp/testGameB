import json

from fastapi import HTTPException, WebSocket, WebSocketDisconnect
from fastapi.routing import APIRouter

from Data.Data import SocketMessage
from Data.Game.LGame import start_game, started_games
from Data.Room import DRooms
from Data.Room.ARooms import get_all_rooms
from Data.WSManager import ConnectionManager

LobbyRouter = APIRouter()
LobbyRouter.prefix = "/lobby"


@LobbyRouter.post("/out_room")
def out_room(
        room: str,
        nickname: str
):
    DRooms.rooms[room]["players"].remove(nickname)
    return get_all_rooms()


@LobbyRouter.get("/ready_status")
def get_ready_status(room):
    return DRooms.rooms[room]


@LobbyRouter.post("/ready")
async def get_ready(player: str, room: str, ready: bool):
    if player in DRooms.rooms[room]["players"]:
        if len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"]:
            pass
        elif ready:
            if player not in DRooms.rooms[room]["ready_players"]:
                DRooms.rooms[room]["ready_players"].append(player)
            else:
                raise HTTPException(status_code=500, detail="Вы уже готовы")
        else:
            if player in DRooms.rooms[room]["ready_players"]:
                DRooms.rooms[room]["ready_players"].remove(player)
            else:
                raise HTTPException(status_code=500, detail="Вы уже не готовы")

        print(len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"])

        if len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"]:
            start_game(room)
            await websocket_endpoint_lobby(None, player)
            return "Ok"
    await websocket_endpoint_lobby(None, player)
    return get_lobby_status(player)


@LobbyRouter.get("/set_sex")
async def set_sex(player: str,
            room: str,
            woman: bool):
    # DRooms.rooms[room]["woman_players"]
    if woman:
        if player in DRooms.rooms[room]["woman_players"]:
            raise HTTPException(status_code=500, detail="Вы уже женщина!")
        else:
            DRooms.rooms[room]["woman_players"].append(player)
    elif not woman:
        if player not in DRooms.rooms[room]["woman_players"]:
            raise HTTPException(status_code=500, detail="Вы уже мужчина!")
        else:
            DRooms.rooms[room]["woman_players"].remove(player)
    await websocket_endpoint_lobby(None, player)
    # print(DRooms.rooms[room]["woman_players"])


@LobbyRouter.get("/lobby_status")
async def get_lobby_status(name: str):
    data = status_helper(name)
    print(data)
    await websocket_endpoint_lobby(None, name)
    return data


def status_helper(player: str):
    for room in DRooms.rooms:
        if player in DRooms.rooms[room]["players"]:
            return {"status": "r", "room": DRooms.rooms[room], "name": room}
    for game in started_games:
        for i in range(0, len(started_games[game].players)):
            if player in started_games[game].players[i].nickname:
                return {"status": "g", "game": game}
    return {"status": "n"}


manager = ConnectionManager()


@LobbyRouter.websocket("/lobby")
async def websocket_endpoint_lobby(websocket: WebSocket or None, name: str):
    if websocket is None:
        await manager.broadcast(json.dumps(status_helper(name)))
        return
    await manager.connect(websocket)
    try:
        while True:
            await manager.send_personal_message(json.dumps(status_helper(name)), websocket)
            data = await websocket.receive_json()
            data = json.loads(data)
            data = SocketMessage(data)

            await manager.broadcast(json.dumps(status_helper(name)))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
