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


# @GameRouter.post("/game_action")
# def action(
#         player: str,
#         room: str,
#         action: str,
# ):
#     if started_games[room].players[started_games[room].queue] != player:
#         raise HTTPException(status_code=500, detail="Не ваш ход")
#     elif action == "end":
#         queue_plus(room)
#     return get_game_status(room)


@GameRouter.get("/check")
def action(
        name: str,
):
    for game in started_games:
        for player in started_games[game].players:
            if name in player.nickname:
                return game
    return "test"


def get_game_status(room):
    return started_games[room]


def test2():
    test_nick = "Dimka"
    test_room = "test"
    # DRooms.rooms[test_room] = {
    #     "players": [test_nick, "nedimka"],
    #     "count_players": 2,
    #     "ready_players": [test_nick, "nedimka"],
    #     "woman_players": ["nedimka"],
    # }
    DRooms.rooms[test_room] = {
        "players": [test_nick],
        "count_players": 1,
        "ready_players": [test_nick],
        "woman_players": [test_nick],
    }
    start_game(test_room)
    return get_game(test_room)


manager = ConnectionManager()


@GameRouter.websocket("/game")
async def websocket_endpoint_game(websocket: WebSocket, game_room: str):
    await manager.connect(websocket)
    try:
        while True:
            await manager.send_personal_message(json.dumps(get_game(game_room), default=lambda x: x.__dict__),
                                                websocket)
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
        # return "home"
        test2()
        return
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
        "log": tmp.log
    }
    return ret
