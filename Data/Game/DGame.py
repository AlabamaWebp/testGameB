class GameRoom:
    players = {}
    count_players: int
    ready_players: int
    started: bool = False
    count_cards: int
    cards: []


class Player:
    nickname: str = ""
    lvl: int = 1
    strongest: int = 1
    one_fight_strong: int = 0
    cards: []
    field_cards: []


class AbstractCard:
    name: str = ""


class TreasureCard(AbstractCard):
    strong: int = 0
    cost: int = 0
    placeholder: int


class MonsterCard(AbstractCard):
    strongest: int = 0
    gold: int = 1
    lvl: int = 1
    punishment: int = 1
