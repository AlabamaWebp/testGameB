class GameRoom:
    players = {}
    count_players: int
    ready_players: int
    started: bool = False
    count_cards: int
    doors: []
    treasures: []


class Player:
    nickname: str = ""
    lvl: int = 1
    strongest: int = lvl
    one_fight_strong: int = 0
    cards: []
    field_cards: []


class AbstractCard:
    name: str = ""


class TreasureCard(AbstractCard):
    strong: int = 0
    cost: int = 0
    template: str


class MonsterCard(AbstractCard):
    lvl: int = 1
    strongest: int = lvl
    gold: int = 1
    undead: bool = False
    punishment: int = 1


class CourseCard(AbstractCard):
    action: str
    strongest: int
