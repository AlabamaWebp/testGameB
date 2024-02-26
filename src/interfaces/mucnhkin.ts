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
        name: string,
        description: string,
        type: "Класс" | "Раса" | "Проклятие" | "Монстр" | "Сокровище",
        img: string | undefined = undefined,
    ) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.img = img;
    }
    name: string;
    description: string;
    img: string;
    type: "Класс" | "Раса" | "Проклятие" | "Монстр" | "Сокровище"
}
export class TreasureCard extends AbstractCard {
    strong: number = 0
    cost: number = 0
    template: string
}

export class MonsterCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        lvl: number,
        gold: number,
        undead: boolean,
        punishment: (player: PlayerGame) => void = undefined,
        startActions: (player: PlayerGame) => void = undefined,
        winActions: (player: PlayerGame) => void = undefined,
        beforeSmivka: (player: PlayerGame) => void = undefined,
        img: string = ""
    ) {
        super(name, description, "Монстр", img);
        this.lvl = lvl;
        this.strongest = lvl;
        this.gold = gold;
        this.undead = undead;
        this.punishment = punishment;
        this.startActions = startActions;
        this.winActions = winActions;
        this.beforeSmivka = beforeSmivka;
    }
    lvl: number;
    strongest: number;
    gold: number;
    undead: boolean;
    punishment: (player: PlayerGame) => void | undefined;
    startActions: (player: PlayerGame) => void | undefined;
    winActions: (player: PlayerGame) => void | undefined;
    beforeSmivka: (player: PlayerGame) => void | undefined;
}

export class CourseCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        action: (player: PlayerGame) => void,

        img: string = ""
    ) {
        super(name, description, "Класс", img);
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
        super(name, description, "Класс", img);
    }
}
export class RassCard extends AbstractCard {
    constructor(
        name: string,
        description: string,

        img: string = ""
    ) {
        super(name, description, "Раса", img);
    }
}