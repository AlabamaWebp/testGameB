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
        this.queue = players[0];
        // this.sbros = [];
        this.step = 0;
        this.log = ["1. Игра началась!"];
        this.is_fight = false;
        
        // this.cards = [];

    }
    readonly name: string;
    // readonly game: "Munchkin"
    private players: PlayerGame[];
    readonly countPlayers: number;
    private queue: PlayerGame;

    private cards: { doors: any[], treasures: any[] };
    private sbros: { doors: any[], treasures: any[] };
    private step: 0 | 1 | 2; // перед боем, бой, после боя
    private is_fight: boolean;
    private log: string[];
    private number_log: number = 2;
    getDataForPlayer() {
        return {
            q: this.queue,
            s: this.step,
            isf: this.is_fight
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
    private lvl: number;
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
    rasses?: RassCard[]
    classes?: ClassCard[]
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
    img: string;
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
        super({name, description, cardType: "Сокровище", img});
        this.data = data;
        this.strong = strongest;
    }
    strong: number | undefined;
    data: TreasureData;
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

export class MonsterCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        lvl: number,
        gold: number,
        undead: boolean,
        defs: MonsterDefs,
        img: string = ""
    ) {
        super({name, description, cardType: "Монстр", img});
        this.lvl = lvl;
        this.strongest = lvl;
        this.gold = gold;
        this.undead = undead;
        this.defs = defs;
    }
    lvl: number;
    strongest: number;
    gold: number;
    undead: boolean;
    defs: MonsterDefs;
}
export interface MonsterDefs {
    punishment?: (defs: defsData) => void | undefined,
    startActions?: (defs: defsData) => void | undefined,
    winActions?: (defs: defsData) => void | undefined,
    beforeSmivka?: (defs: defsData) => void | undefined,
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}

export class CourseCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        action: (defs: defsData) => void,

        img: string = ""
    ) {
        super({name, description, cardType: "Проклятие", img});
        this.action = action;
    }
    action: (defs: defsData) => void;
}

export class ClassCard extends AbstractCard {
    constructor(
        name: string,
        description: string,

        img: string = ""
    ) {
        super({name, description, cardType: "Класс", img});
    }
}
export class RassCard extends AbstractCard {
    constructor(
        name: string,
        description: string,

        img: string = ""
    ) {
        super({name, description, cardType: "Раса", img});
    }
}