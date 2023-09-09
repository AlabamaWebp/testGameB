import json
import random
from inspect import getmembers

from fastapi import HTTPException, WebSocket, WebSocketDisconnect
from fastapi.routing import APIRouter
from websockets.exceptions import ConnectionClosedOK

from Data.Game.DGame import GameRoom, Player, TreasureCard, MonsterCard, CourseCard
from Data.Game.LGame import started_games, start_game, read, queue_plus
from Data.Room import DRooms
import csv

from Data.WSManager import ConnectionManager

GameRouter = APIRouter()
GameRouter.prefix = "/game"


@GameRouter.get("/lobby_status")
def get_lobby_status(name: str):
    for room in DRooms.rooms:
        if name in DRooms.rooms[room]["players"]:
            return {"status": "r", "room": DRooms.rooms[room], "name": room}
    for game in started_games:
        for i in range(0, len(started_games[game].players)):
            if name in started_games[game].players[i].nickname:
                return {"status": "g", "game": game}
    return {"status": "n"}


@GameRouter.get("/game_status")
def get_game_status(room):
    return started_games[room]


@GameRouter.get("/set_sex")
def set_sex(player: str,
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
    print(DRooms.rooms[room]["woman_players"])


@GameRouter.get("/ready_status")
def get_ready_status(room):
    return DRooms.rooms[room]


@GameRouter.post("/ready")
def get_ready(player: str, room: str, ready: bool):
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
            return start_game(room)

    return get_lobby_status(player)


@GameRouter.post("/game_action")
def action(
        player: str,
        room: str,
        action: str,
):
    if started_games[room].players[started_games[room].queue] != player:
        raise HTTPException(status_code=500, detail="Не ваш ход")
    elif action == "end":
        queue_plus(room)
    return get_game_status(room)


# @GameRouter.get("/game")


# @GameRouter.get("/test")
def test2():
    test_nick = "Dimka"
    test_room = "test"
    DRooms.rooms[test_room] = {
        "players": [test_nick, "nedimka"],
        "count_players": 2,
        "ready_players": [test_nick, "nedimka"],
        "woman_players": ["nedimka"],
    }
    start_game(test_room)
    return get_game(test_room)


manager = ConnectionManager()


@GameRouter.websocket("/game")
async def websocket_endpoint(websocket: WebSocket, game_room: str):
    await manager.connect(websocket)
    try:
        while True:
            await manager.send_personal_message(json.dumps(get_game(game_room), default=lambda x: x.__dict__), websocket)
            data = await websocket.receive_text()
            data = json.loads(data)
            await manager.broadcast(json.dumps(get_game(game_room), default=lambda x: x.__dict__,
                                               ensure_ascii=True, separators=(',', ':')))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except ConnectionClosedOK:
        manager.disconnect(websocket)


def get_game(
        room: str,
):
    if room not in started_games.keys():
        test2()
    tmp = started_games[room]
    players = list()
    for pl in tmp.players:
        players.append({
            "nickname": pl.nickname,
            "lvl": pl.lvl,
            "strongest": pl.strongest,
            "one_fight_strong": pl.one_fight_strong,
            "sex": pl.sex,
            "cards": pl.cards,
            "field_cards": pl.field_cards,
        })
    ret = {
        "players": players,
        "count_players": tmp.count_players,
        "doors": tmp.doors,
        "treasures": tmp.treasures,
        "sbros_doors": tmp.sbros_doors,
        "sbros_treasures": tmp.sbros_treasures,
        "queue": tmp.queue,
        "step": tmp.step,
    }
    return ret
