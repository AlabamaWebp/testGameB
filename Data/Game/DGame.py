class GameRoom:
    players = list()
    count_players: int = 2
    doors: list = list()
    treasures: list = list()
    sbros_doors: list = list()
    sbros_treasures: list = list()
    queue: int = 0
    step: int = 1
    # ready_players: int
    # started: bool = False
    # count_cards: int


class Player:
    nickname: str = ""
    lvl: int = 1
    strongest: int = lvl
    one_fight_strong: int = 0
    cards: list = list()
    field_cards: list = list()


class AbstractCard:
    name: str = ""
    type: str = ""


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
