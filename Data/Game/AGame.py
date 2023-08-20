import csv

from fastapi.routing import APIRouter

from Data.Game.DGame import GameRoom, Player, TreasureCard
from Data.Room import DRooms
import csv

GameRouter = APIRouter()

started_games = {}


@GameRouter.get("/lobby_status")
def get_lobby_status(room):
    return DRooms.rooms[room]


@GameRouter.post("/ready")
def get_ready(player: str, room: str, ready: bool):
    if player in DRooms.rooms[room]["players"]:
        if len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"]:
            pass
        elif ready:
            DRooms.rooms[room]["ready_players"].append(player)
        else:
            DRooms.rooms[room]["ready_players"].remove(player)

        print(len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"])

        if len(DRooms.rooms[room]["ready_players"]) == DRooms.rooms[room]["count_players"]:
            return start_game(room)

    return get_lobby_status(room)

@GameRouter.get("/test")
async def test():
    return read()

path = "Data/Cards/standart/"


def read():
    temp = {
        "treasure": {},
        "monsters": {},
        "curses": {}
    }
    with open(path+'Treasure.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["treasure"] = reader_helper(reader)
    with open(path+'Monsters.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["monsters"] = reader_helper(reader)
    with open(path+'Curses.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["curses"] = reader_helper(reader)
    return temp


def reader_helper(reader):
    temp = {}
    i = 0
    tmp_names = []
    for row in reader:
        for j in range(0, len(row)):
            if i == 0:
                temp[row[j]] = list()
                tmp_names.append(row[j])
            else:
                temp[tmp_names[j]].append(row[j])
            print(row[j])
        print(tmp_names, i)
        i = i + 1
    return temp


def start_game(room):
    groom = GameRoom()
    # groom.cards =
    for i in DRooms.rooms[room]["players"]:
        tmp = Player()
        tmp.nickname = i
        # for i in range(0, 3):
        #     card = TreasureCard()
        #
        #     tmp.cards.append()
        groom.players[i] = Player()
        groom.players[i].nickname = i
    started_games[room] = groom
    del DRooms.rooms[room]
    return started_games[room]
