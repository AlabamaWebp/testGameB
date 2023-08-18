import csv

from fastapi.routing import APIRouter

from Data.Game.DGame import GameRoom, Player
from Data.Room import DRooms
from csv import reader

GameRouter = APIRouter()

started_games = {}


@GameRouter.post("/ready")
def get_ready(player: str, room: str, ready: bool):
    if player in DRooms.rooms[room]["players"]:
        if len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"]:
            1
        elif ready:
            DRooms.rooms[room]["ready_players"].append(player)
        else:
            DRooms.rooms[room]["ready_players"].remove(player)
        print(len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"])
        if len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"]:
            started_games[room] = GameRoom()
            for i in DRooms.rooms[room]["players"]:
                started_games[room].players[i] = Player()
                started_games[room].players[i].nickname = i
        del DRooms.rooms[room]
        return started_games[room].players
    return started_games


@GameRouter.get("/test")
async def test():
    with open('Data/Cards/Treasure.csv', "r", newline="") as csvfile:
        read = reader(csvfile, delimiter=";", quotechar="|")
        # tmp = "".join(read)
        for row in read:
            print(', '.join(row))
    # return tmp
