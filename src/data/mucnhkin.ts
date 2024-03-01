import { CLASSES } from "src/cards/Munchkin/doors/Classes";
import { PlayerGlobal } from "./main";
import { COURSES } from "src/cards/Munchkin/doors/Courses";
import { MONSTERS } from "src/cards/Munchkin/doors/Monsters";
import { RASES } from "src/cards/Munchkin/doors/Rases";
import { EQUIPMENT } from "src/cards/Munchkin/treasures/equipment";
import { USED } from "src/cards/Munchkin/treasures/used";
import { COMBAT } from "src/cards/Munchkin/treasures/combat";
import { fillId, p_getFieldCards, playersGetCard, shuffle } from "./munchkin/functions";
import { AbstractData, DoorsDefs, MonsterData, TreasureData, fieldDoorCards, fieldTreasureCards } from "./munchkin/interfaces";

export class Game {
    constructor(name: string, players: PlayerGame[]) {
        this.name = name;
        // this.game = "Munchkin"
        this.players = players;
        this.plcount = players.length;
        this.log = ["1. Игра началась!"];
        this.is_fight = false;
        this.cards = {
            doors: shuffle(CLASSES.concat(COURSES).concat(MONSTERS).concat(RASES)),
            treasures: shuffle(EQUIPMENT.concat(USED).concat(COMBAT))
        }
        fillId.call(this);
        playersGetCard.call(this);
        
    }

    readonly plcount: number;
    readonly name: string;
    private players: PlayerGame[];

    private cards: { doors: DoorsCard[], treasures: TreasureCard[] };
    private sbros: { doors: DoorsCard[], treasures: TreasureCard[] };
    private step: 0 | 1 | 2 = 0; // перед боем | бой | после боя
    private queue: number = 0;
    private is_fight: boolean;
    private log: string[];
    private number_log: number = 2;

    PlayerGetCard() {

    }

    private getDataForPlayer(player: PlayerGlobal) {
        const plg = this.players.find(el => el.player == player)
        const pls = this.players
            .filter(el => el.player != player)
            .map((el: PlayerGame) => {
                return {
                    name: el.player.name,
                    lvl: el.lvl,
                    sex: el.sex,
                    t_field: p_getFieldCards(el.t_field_cards),
                    d_field: p_getFieldCards(el.d_field_cards)
                }
            })
        return {
            queue: this.players[this.queue],
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
    private logging(l: string) {
        l = l.toString();
        this.log.push(this.number_log + ". " + l);
    }
    private playersGameRefresh() {
        this.players.forEach((el: PlayerGame) => {
            el.player.socket.emit("refreshGame", this.getDataForPlayer(el.player))
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
    t_field_cards: fieldTreasureCards;
    d_field_cards: fieldDoorCards;

    cards: (TreasureCard | DoorsCard)[];

    alive: boolean;

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
    abstractData: AbstractData;
    id: number;
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
            abstractData: this.abstractData,
            strongest: this.strong,
            data: this.data,
            // name: this.abstractData.name,
            // desciption: this.abstractData.description,
            // cardType: this.abstractData.cardType,
            // strongest: this.strong,
            // treasureType: this.data.treasureType,
            // template: this.data.template,
            // cost: this.data.cost,
            // big: this.data.big,
            // img: this.abstractData.img
        }
    }
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