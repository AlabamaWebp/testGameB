class GameRoom:
    players = []
    count_players: int
    ready_players: int
    started: bool = False
    count_cards: int
    doors: []
    treasures: []
    sbros_doors: [] = []
    sbros_treasures: [] = []
    queue: int
    step: int = 1


class Player:
    nickname: str = ""
    lvl: int = 1
    strongest: int = lvl
    one_fight_strong: int = 0
    cards: []
    field_cards: [] = []
    sex: bool


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


class SendPlayer:
    nickname: str = ""
    lvl: int = 1
    strongest: int = lvl
    one_fight_strong: int = 0
    field_cards: [] = []
    sex: bool
