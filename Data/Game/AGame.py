import random

from fastapi import HTTPException
from fastapi.routing import APIRouter

from Data.Game.DGame import GameRoom, Player, TreasureCard, MonsterCard, CourseCard
from Data.Room import DRooms
import csv

GameRouter = APIRouter()
GameRouter.prefix = "/game"

started_games: {str: GameRoom} = dict()


@GameRouter.get("/lobby_status")
def get_lobby_status(name: str):
    for room in DRooms.rooms:
        if name in DRooms.rooms[room]["players"]:
            return {"status": "r", "room": DRooms.rooms[room], "name": room}
    for game in started_games:
        if name in started_games[game].players:
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


def queue_plus(room):
    if started_games[room].queue + 1 > len(started_games[room].players):
        started_games[room].queue = 0
    else:
        started_games[room].queue = started_games[room].queue + 1

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
    print(temp)
    return temp


def reader_helper(reader, card_type):
    # card_type 0 = treasure, 1 = monsters, 2 = curses
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
    if card_type == 0:
        for card in temp:
            tmp = TreasureCard()
            tmp.name = card["name"]
            tmp.strong = card["strong"]
            tmp.template = card["template"]
            tmp.test = card["cost"]
            ret.append(tmp)
    elif card_type == 1:
        for card in temp:
            tmp = MonsterCard()
            tmp.name = card["name"]
            tmp.lvl = card["lvl"]
            tmp.punishment = card["punishment"]
            tmp.gold = card["gold"]
            tmp.undead = card["undead"]
            ret.append(tmp)
    elif card_type == 2:
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
    for i in range(0, len(cards["treasure"])):
        cards["treasure"].append(cards["treasure"][i])
    for i in range(0, len(cards["monsters"])):
        cards["monsters"].append(cards["monsters"][i])
    for i in range(0, len(cards["curses"])):
        cards["curses"].append(cards["curses"][i])
    # raise HTTPException(status_code=500, detail="pizdez")

    # перетасовка
    for card in cards["monsters"]:
        groom.doors.append(card)
    for card in cards["curses"]:
        groom.doors.append(card)
    random.shuffle(groom.doors)

    groom.treasures.append(cards["treasure"])
    for card in cards["treasure"]:
        groom.treasures.append(card)
    random.shuffle(groom.treasures)
    print(len(groom.treasures), len(groom.doors))
    # Раздача карт
    # groom.players = DRooms.rooms[room]["players"]
    for name in DRooms.rooms[room]["players"]:
        player = Player()
        player.nickname = name
        player.lvl = 1
        for i in range(0, 3):
            player.cards.append(get_card(True, groom))
        for i in range(0, 3):
            player.cards.append(get_card(False, groom))
        groom.players.append(player)

    # Начало цикла ходов
    groom.queue = random.uniform(0, len(groom.players))
    groom.step = 1

    started_games[room] = groom
    del DRooms.rooms[room]
    return started_games[room]


def get_card(treasure, groom):
    print(len(groom.treasures), len(groom.doors))
    if treasure:
        return groom.treasures.pop()
    else:
        return groom.doors.pop()
