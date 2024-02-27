import { PlayerGlobal } from "./main";

export class Game {
    constructor(name: string, players: PlayerGame[]) {
        this.name = name;
        // this.game = "Munchkin"
        this.players = players;
        this.countPlayers = players.length;
        this.queue = players[0];
        this.cards = [];
        this.sbros = [];
        this.step = 0;
        this.log = [];
        this.is_fight = false;
    }
    readonly name: string;
    // readonly game: "Munchkin"
    private players: PlayerGame[];
    readonly countPlayers: number;
    private queue: PlayerGame;

    private cards: { doors: any, treasures: any }[];
    private sbros: { doors: any, treasures: any }[];
    private step: 0 | 1 | 2; // перед боем, бой, после боя
    private is_fight: boolean;
    private log: string[]

}
export class PlayerGame {
    constructor(player: PlayerGlobal, sex: "Мужчина" | "Женщина") {
        this.lvl = 1;
        this.boost = 0;
        this.player = player;
        this.sex = sex;
        this.field_cards = [];
        this.alive = true;
    }
    private lvl: number;
    private boost: number;
    private field_cards: any;
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
    type: "Класс" | "Раса" | "Проклятие" | "Монстр" | "Сокровище"
    img: string;
}
// Bonus Ability Fight
export class TreasureCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        data: TreasureData,
        strongest: number | undefined = undefined,
        img: string = ""
    ) {
        super({name, description, type: "Сокровище", img});
        this.data = data;
        this.strong = strongest;
    }
    strong: number | undefined;
    data: TreasureData;
}

export interface TreasureData {
    template: "Шлем" | "Тело" | "Ноги" | "Рука" 
    | "2 Руки" | "3 Руки" | "Рядом" | undefined

    cost: number | undefined
    defs: TreasureDefs | undefined
}
export interface TreasureDefs {
    condition: () => boolean
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
        super({name, description, type: "Монстр", img});
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
    punishment?: () => void | undefined,
    startActions?: () => void | undefined,
    winActions?: () => void | undefined,
    beforeSmivka?: () => void | undefined,
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}

export class CourseCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        action: (player: PlayerGame) => void,

        img: string = ""
    ) {
        super({name, description, type: "Проклятие", img});
        this.action = action;
    }
    action: (player: PlayerGame) => void;
}

export class ClassCard extends AbstractCard {
    constructor(
        name: string,
        description: string,

        img: string = ""
    ) {
        super({name, description, type: "Класс", img});
    }
}
export class RassCard extends AbstractCard {
    constructor(
        name: string,
        description: string,

        img: string = ""
    ) {
        super({name, description, type: "Раса", img});
    }
}