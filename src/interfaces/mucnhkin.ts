import { PlayerGlobal } from "./main";

export interface defsData {
    player?: PlayerGame
    game?: Game
}

export class Game {
    constructor(name: string, players: PlayerGame[]) {
        this.name = name;
        // this.game = "Munchkin"
        this.players = players;
        this.countPlayers = players.length;
        this.log = ["1. Игра началась!"];
        this.is_fight = false;

        // this.cards = [];

    }
    readonly name: string;
    // readonly game: "Munchkin"
    private players: PlayerGame[];
    readonly countPlayers: number;

    private cards: { doors: TreasureCard[], treasures: DoorsCard[] };
    private sbros: { doors: TreasureCard[], treasures: DoorsCard[] };
    private step: 0 | 1 | 2 = 0; // перед боем, бой, после боя
    private queue: number = 0;
    private is_fight: boolean;
    private log: string[];
    private number_log: number = 2;
    getDataForPlayer(player: PlayerGlobal) {
        const plg = this.players.find(el => el.player == player)
        const pls = this.players
            .filter(el => el.player != player)
            .map((el: PlayerGame) => {
                return {
                    name: el.player.name,
                    lvl: el.lvl,
                    sex: el.sex,
                    field_cards: el.field_cards
                }
            })
        return {
            queue: this.queue,
            step: this.step,
            is_fight: this.is_fight,
            sbros:
            {
                doors: this.sbros.doors[this.sbros.doors.length],
                treasures: this.sbros.treasures[this.sbros.treasures.length]
            },
            log: this.log,
            players: pls,
            you: plg

        }
    }
    logging(l: string) {
        l = l.toString();
        this.log.push(this.number_log + ". " + l);
    }
    playersGameRefresh() {
        this.players.forEach((el: PlayerGame) => {
            el.player.socket.emit()
        })
    }
}
export class PlayerGame {
    constructor(player: PlayerGlobal, sex: "Мужчина" | "Женщина") {
        this.lvl = 1;
        this.player = player;
        this.sex = sex;
        this.alive = true;
    }
    lvl: number;
    field_cards: fieldCards;
    private alive: boolean;

    readonly player: PlayerGlobal;
    readonly sex: "Мужчина" | "Женщина";
    changeLvl(count: number) {
        this.lvl += count;
        if (this.lvl < 1)
            this.lvl = 1;
        if (this.lvl > 10) {
            // победа
        }
    }
}
interface fieldCards {
    helmet?: TreasureCard[]
    body?: TreasureCard[]
    legs?: TreasureCard[]
    arm?: TreasureCard[]
    other?: TreasureCard[]
    rasses?: DoorsCard[]
    classes?: DoorsCard[]
}
class AbstractCard {
    constructor(
        data: AbstractData
    ) {
        this.abstractData = data
    }
    abstractData: AbstractData
}
export interface AbstractData {
    name: string;
    description: string;
    cardType: "Класс" | "Раса" | "Проклятие" | "Монстр" | "Сокровище"
    img?: string;
}
// Bonus Ability Fight
export class TreasureCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        data?: TreasureData,
        strongest?: number,
        img: string = ""
    ) {
        super({ name, description, cardType: "Сокровище", img });
        this.data = data;
        this.strong = strongest;
    }
    strong: number | undefined;
    data: TreasureData;
    getData() {
        return {
            name: this.abstractData.name,
            desciption: this.abstractData.description,
            cardType: this.abstractData.cardType,
            strongest: this.strong,
            treasureType: ,

            template?: ,
        
            cost?: ,
            big?: ,
            img: this.abstractData.img
        }
    }
}

export interface TreasureData {
    treasureType: "Надеваемая" | "Используемая" | "Боевая"

    template?: "Шлем" | "Броник" | "Ноги" | "Рука"
    | "2 Руки" | "3 Руки" | "Рядом" | undefined

    cost?: number | undefined
    defs?: TreasureDefs | undefined
    big?: boolean | undefined
}
export interface TreasureDefs {
    condition?: (defs: defsData) => boolean
    action?: (defs: defsData) => void
}

export class DoorsCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        type: "Класс" | "Раса" | "Проклятие" | "Монстр",
        monster?: {
            lvl: number,
            gold: number,
            undead?: boolean,
        },
        defs?: DoorsDefs,
        img?: string
    ) {
        super({ name, description, cardType: type, img });
        monster ? this.monsterData = {
            lvl: monster.lvl,
            strongest: monster.lvl,
            gold: monster.gold,
            undead: monster.undead ? true : false
        } : 0;
        this.defs = defs;
    }
    monsterData?: MonsterData;
    defs: DoorsDefs;
}
export interface DoorsDefs {
    punishment?: (defs: defsData) => void,
    startActions?: (defs: defsData) => void,
    winActions?: (defs: defsData) => void,
    beforeSmivka?: (defs: defsData) => void,
    action?: (defs: defsData) => void,
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}
export interface MonsterData {
    lvl: number;
    strongest: number;
    gold: number;
    undead: boolean;
}