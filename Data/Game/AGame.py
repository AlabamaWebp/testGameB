import random

from fastapi import HTTPException
from fastapi.routing import APIRouter

from Data.Game.DGame import GameRoom, Player, TreasureCard, MonsterCard, CourseCard
from Data.Game.LGame import started_games, start_game, read, queue_plus
from Data.Room import DRooms
import csv

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


@GameRouter.get("/test")
async def test():
    return read()


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

