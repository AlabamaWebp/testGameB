import csv
import math
import random

from fastapi import HTTPException

from Data.Game.DGame import GameRoom, MonsterCard, CourseCard, TreasureCard, Player
from Data.Room import DRooms

started_games: {str: GameRoom()} = dict()


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
    # добавить функцию ниже
    with open(path + 'Treasure.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["treasure"] = reader_helper(reader, 0)
        temp["treasure"] = set_type("treasure", temp)
    with open(path + 'Monsters.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["monsters"] = reader_helper(reader, 1)
        temp["monsters"] = set_type("monsters", temp)
    with open(path + 'Curses.csv', "r", newline="") as csvfile:
        reader = csv.reader(csvfile, delimiter=";", quotechar="|")
        temp["curses"] = reader_helper(reader, 2)
        temp["curses"] = set_type("curses", temp)
    return temp


def set_type(type: str, temp):
    ret = list()
    for t in temp[type]:
        t.type = type
        ret.append(t)
    return ret


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
    if room in started_games.keys():
        print(started_games, started_games.keys())
        raise HTTPException(status_code=500, detail="Комната уже существует")
    groom = GameRoom()
    cards = read()

    # Карты x2
    # for i in range(0, len(cards["treasure"])):
    #     cards["treasure"].append(cards["treasure"][i])
    # for i in range(0, len(cards["monsters"])):
    #     cards["monsters"].append(cards["monsters"][i])
    # for i in range(0, len(cards["curses"])):
    #     cards["curses"].append(cards["curses"][i])
    # raise HTTPException(status_code=500, detail="pizdez")

    # перетасовка
    for card in cards["monsters"]:
        groom.doors.append(card)
    for card in cards["curses"]:
        groom.doors.append(card)
    random.shuffle(groom.doors)

    # groom.treasures.append(cards["treasure"])
    for card in cards["treasure"]:
        groom.treasures.append(card)
    random.shuffle(groom.treasures)
    # Раздача карт
    # groom.players = DRooms.rooms[room]["players"]
    for name in DRooms.rooms[room]["players"]:
        player = Player()
        player.nickname = name
        player.lvl = 1
        plcards = list()
        for i in range(0, 4):
            plcards.append(get_card(True, groom))
        for i in range(0, 4):
            plcards.append(get_card(False, groom))
        player.cards = plcards
        if name in DRooms.rooms[room]["woman_players"]:
            player.sex = False
        groom.players.append(player)
    groom.count_players = len(groom.players)

    # Начало цикла ходов
    groom.queue = math.floor(random.uniform(0, len(groom.players)))
    groom.step = 1

    started_games[room] = groom
    del DRooms.rooms[room]
    return started_games[room]


def get_card(treasure, groom):
    if treasure:
        return groom.treasures.pop()
    else:
        return groom.doors.pop()
