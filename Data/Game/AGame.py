import csv
import random

from fastapi.routing import APIRouter

from Data.Game.DGame import GameRoom, Player, TreasureCard, MonsterCard, CourseCard
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
        "treasure": list(),
        "monsters": list(),
        "curses": list(),
    }
    with open(path + 'Treasure.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["treasure"] = reader_helper(reader, 0)
    with open(path + 'Monsters.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["monsters"] = reader_helper(reader, 1)
    with open(path + 'Curses.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["curses"] = reader_helper(reader, 2)
    return temp


def reader_helper(reader, type):
    temp = []
    i = 0
    tmp_names = []
    for row in reader:
        card = dict()
        for j in range(0, len(row)):
            if i == 0:
                card[row[j]] = list()
                tmp_names.append(row[j])
            else:
                card[tmp_names[j]] = row[j]
        if i != 0:
            temp.append(card)
        i = i + 1
    ret = list()
    if type == 0:
        for card in temp:
            tmp = TreasureCard()
            tmp.name = card["name"]
            tmp.strong = card["strong"]
            tmp.template = card["template"]
            tmp.test = card["cost"]
            ret.append(tmp)
    elif type == 1:
        for card in temp:
            tmp = MonsterCard()
            tmp.name = card["name"]
            tmp.lvl = card["lvl"]
            tmp.punishment = card["punishment"]
            tmp.gold = card["gold"]
            tmp.undead = card["undead"]
            ret.append(tmp)
    elif type == 2:
        for card in temp:
            tmp = CourseCard()
            tmp.name = card["name"]
            tmp.action = card["action"]
            tmp.strongest = card["strongest"]
            ret.append(tmp)
    return ret


# "treasure"
# "monsters"
# "curses"

def start_game(room):
    groom = GameRoom()
    cards = read()

    # Карты x2
    for i in cards["treasure"]:
        cards["treasure"].append(i)
    for i in cards["monsters"]:
        cards["monsters"].append(i)
    for i in cards["curses"]:
        cards["curses"].append(i)

    # перетасовка
    groom.doors.append(cards["monsters"])
    groom.doors.append(cards["curses"])
    random.shuffle(groom.doors)

    groom.treasures.append(random.shuffle(cards["treasure"]))

    #
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
