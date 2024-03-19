
import { PlayerGlobal } from "./main";
import { fillId, p_getFieldCards, playersGetCard, shuffle } from "./munchkin/functions";
import { AbstractData, DoorsDefs, MonsterData, TreasureData, fieldDoorCards, fieldTreasureCards, GameField, TreasureDefs } from "./munchkin/interfaces";
import { Socket } from "socket.io";

// refreshGame plusLog allLog
export class PlayerGame {
    constructor(player: PlayerGlobal, sex: "Мужчина" | "Женщина", queue: number) {
        this.lvl = 1;
        this.player = player;
        this.sex = sex;
        this.alive = true;
        this.queue = queue; // Очередь игрока
    }
    readonly queue: number;

    private lvl: number = 1;
    private power: number = 1;
    t_field_cards = new fieldTreasureCards(); // Шмотки
    d_field_cards = new fieldDoorCards(); // Классы Рассы

    cards: (TreasureCard | DoorsCard)[] = [];
    private maxCards: number = 5;

    alive: boolean;


    readonly player: PlayerGlobal;
    readonly sex: "Мужчина" | "Женщина";

    get getStrongest() {
        this.power = 0;
        const cards = Object.values(this.t_field_cards);
        cards.forEach((el: TreasureCard) => this.power += el.strong)
        return this.power;
    }

    get data() {
        return {
            name: this.player.name,
            lvl: this.lvl,
            sex: this.sex,
            cards: this.cards.map(el => el.getData()),
            t_field: {
                helmet: this.t_field_cards?.helmet?.map(el => el.getData()),
                body: this.t_field_cards?.body?.map(el => el.getData()),
                legs: this.t_field_cards?.legs?.map(el => el.getData()),
                arm: this.t_field_cards?.arm?.map(el => el.getData()),
                other: this.t_field_cards?.other?.map(el => el.getData()),
            }, d_field: {
                rasses: this.d_field_cards?.rasses?.map(el => el.getData()),
                classes: this.d_field_cards?.classes?.map(el => el.getData()),
            },
            queue: this.queue,
            max_cards: this.maxCards
        }
    }

    changeLvl(count: number) {
        this.lvl += count;
        if (this.lvl < 1)
            this.lvl = 1;
        if (this.lvl > 10) {
            // победа
        }
    }

    useCard(id: number) {
        const card: TreasureCard | DoorsCard = this.cards.find(el => el.id == id);
        if (!card) return;
        const help = {
            "Шлем": 'helmet',
            "Броник": 'body',
            "Ноги": 'legs',
            "Рука": 'arm',
        }
        //  "Рядом" 
        // other
        const game = this.player.position as Game;
        if (card instanceof TreasureCard) {
            //////////////
            if (card.data.treasureType == 'Надеваемая') {
                const template_eng = help[card.data.template]
                // if (!this.t_field_cards) this.t_field_cards 
                if (this.t_field_cards[template_eng] && this.t_field_cards[template_eng].length) {
                    const tmp = this.t_field_cards[template_eng]
                    while (tmp.length) {
                        game.toSbros(this.t_field_cards[template_eng].pop())
                    }
                }
                this.t_field_cards[template_eng] = [card]
                this.cards = this.cards.filter(el => el != card)
            }
        }
        game.playersGameRefresh();
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
        defs?: TreasureDefs,
        data?: TreasureData,
        strongest: number = 0,
        img: string = ""
    ) {
        super({ name, description, cardType: "Сокровище", img });
        this.data = data;
        this.strong = strongest;
        this.defs = defs;
    }
    strong: number;
    data: TreasureData;
    defs?: TreasureDefs
    getData() {
        return {
            abstractData: this.abstractData,
            strongest: this.strong,
            data: this.data,
            id: this.id
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
            strongest: number, // Сила (включая усиления и уровень)
            lvl: number, // Получаемый уровень
            gold: number,
            undead?: boolean,
        },
        defs?: DoorsDefs,
        img?: string
    ) {
        super({ name, description, cardType: type, img });
        monster ? this.data = {
            get_lvls: monster.lvl,
            strongest: monster.lvl,
            gold: monster.gold,
            undead: monster.undead ? true : false
        } : 0;
        this.defs = defs;
    }
    data?: MonsterData;
    defs: DoorsDefs;
    getData() {
        return {
            abstractData: this.abstractData,
            data: this.data,
            id: this.id
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

import { CLASSES } from "src/cards/Munchkin/doors/Classes";
import { COURSES } from "src/cards/Munchkin/doors/Courses";
import { MONSTERS } from "src/cards/Munchkin/doors/Monsters";
import { RASES } from "src/cards/Munchkin/doors/Rases";
import { EQUIPMENT } from "src/cards/Munchkin/treasures/equipment";
import { USED } from "src/cards/Munchkin/treasures/used";
import { COMBAT } from "src/cards/Munchkin/treasures/combat";

export class Game {
    constructor(name: string, players: PlayerGame[]) {
        this.name = name;
        this.players = shuffle(players);
        this.plcount = players.length;
        this.log = [];
        this.logging("Игра началась!");
        this.cards = {
            doors: shuffle(CLASSES.concat(COURSES).concat(MONSTERS).concat(RASES)),
            treasures: shuffle(EQUIPMENT.concat(USED).concat(COMBAT))
        }
        fillId.call(this);
        playersGetCard.call(this);
    }

    readonly plcount: number;
    readonly name: string;
    readonly players: PlayerGame[];

    private cards: { doors: DoorsCard[], treasures: TreasureCard[] };
    private sbros: { doors: DoorsCard[], treasures: TreasureCard[] } = { doors: [], treasures: [] };
    private step: 0 | 1 | 2 | 3 = 0; // перед боем | чистка нычек | бой | после боя
    private queue: number = 0;
    // private is_fight: boolean;
    private log: string[];
    private number_log: number = 1;
    /////////

    field: GameField = new GameField();

    getPlayerById(id: string) {
        return this.players.find(el => el.player.socket.id == id);
    }

    toSbros(card: TreasureCard | DoorsCard) {
        if (card instanceof TreasureCard) {
            this.sbros.treasures.push(card)
        }
        else if (card instanceof DoorsCard) {
            this.sbros.doors.push(card)
        }
        else return
        if (!this.cards.doors.length) {
            this.cards = shuffle(this.sbros.doors.slice());
            this.sbros.doors = []
        }
        else if (!this.cards.treasures.length) {
            if (!this.cards.treasures.length) {
                this.cards = shuffle(this.sbros.treasures.slice());
                this.sbros.treasures = []
            }
        }
    }

    newFightOpenDoor(monster: DoorsCard) {
        this.field.openCards = undefined;
        this.field.fight = {
            players: { main: this.players[this.queue] },
            monsters: [structuredClone(monster)],
            monstersProto: [monster],
            gold: monster.data?.gold
        }
    }
    newFightSamIgrok(monster_id: number) {
        this.field.openCards = undefined;
        const monster = this.cardPlayerById(monster_id) as DoorsCard;
        this.field.fight = {
            players: { main: this.players[this.queue] },
            monsters: [structuredClone(monster)],
            monstersProto: [monster],
            gold: monster.data?.gold
        }
    }
    private openCard(card: TreasureCard | DoorsCard) {
        if (this.field.fight) this.field.fight = undefined;
        if (!this.field.openCards) this.field.openCards = [card];
        else this.field.openCards.push(card)
    }
    /////////
    endHod() {

        this.queue++;
        if (this.queue >= this.plcount)
            this.queue = 0

    }

    ///////// cards

    popPlayerCard(pl: PlayerGame, card: DoorsCard | TreasureCard): DoorsCard | TreasureCard {
        pl.cards = pl.cards.filter(el => el != card);
        return card
    }

    cardPlayerById(id: number): DoorsCard | TreasureCard {
        const pl = this.players[this.queue];
        return this.popPlayerCard(pl, pl.cards.find(el => el.id == id))
    }

    private get getDoor() {
        return this.cards.doors.pop();
    }
    private get getTreasure() {
        return this.cards.treasures.pop();
    }
    private getPlBySocket(player: Socket) {
        return this.players.find(el => el.player.socket = player)
    }
    ////
    playerGetClosedDoor(player: Socket) {
        const pl = this.getPlBySocket(player);
        if (this.step == 2
            && pl == this.players[this.queue]
        ) {
            const card = this.getDoor
            pl.cards.push(card);
            this.logging(pl.player.name + " берёт дверь в закрытую");
            this.onePlayerRefresh(pl);
        }
    }
    private playerGetClosedTreasure(player: Socket, colvo: number) {
        const pl = this.getPlBySocket(player);
        if (pl == this.players[this.queue]
        ) {
            for (let i = 0; i < colvo; i++) {
                const card = this.getDoor
                pl.cards.push(card);
            }
            this.logging(pl.player.name + " берёт в закрытую сокровищ в количестве " + colvo + "шт");
            this.onePlayerRefresh(pl);
        }
    }
    private playerGetOpenDoor(player: Socket) {
        const pl = this.getPlBySocket(player);
        if (this.step == 0
            && pl == this.players[this.queue]
        ) {
            const card = this.getDoor;
            pl.cards.push(card);
            this.logging(pl.player.name + " берёт дверь: " + card.abstractData.name + " в открытую");
            this.onePlayerRefresh(pl);
            this.openCard(card);
        }
    }
    private playerGetOpenTreasure(player: Socket) {
        const pl = this.getPlBySocket(player);
        const card = this.getTreasure;
        pl.cards.push(card);
        this.logging(pl.player.name + " берёт сокровище: " + card.abstractData.name + " в открытую");
        this.onePlayerRefresh(pl);
        this.openCard(card);

    }


    getMainForPlayer(player: PlayerGlobal) {
        const plg = this.players.find(el => el.player == player).data;
        const pls = this.players
            .filter(el => el.player != player)
            .map((el: PlayerGame) => el.data)
        return {
            queue: this.players[this.queue].player.name,
            step: this.step,
            // is_fight: this.is_fight,
            field: this.field.getField,
            sbros:
            {
                doors: this.sbros.doors[this.sbros.doors.length]?.getData(),
                treasures: this.sbros.treasures[this.sbros.treasures.length]?.getData()
            },
            // log: this.log,
            players: pls,
            you: plg
        }
    }
    private logging(l: string) {
        l = l.toString();
        l = this.number_log + ". " + l;
        this.log.push(l);
        this.plusLog(l);
    }
    private logQueue() {
        const name = this.players[this.queue].player.name;

        this.logging("Ход игрока: " + name + " ")
    }


    private broadcast(e: string, d: any) {
        this.players.forEach((el: PlayerGame) => {
            el.player.socket.emit(e, d)
        })
    }
    playersGameRefresh() {
        this.players.forEach((el: PlayerGame) => {
            this.broadcast("refreshGame", this.getMainForPlayer(el.player))
        })
    }
    private onePlayerRefresh(player: PlayerGame) {
        player.player.socket.emit("refreshGame", this.getMainForPlayer(player.player));
    }

    private plusLog(d: string) {
        this.broadcast("plusLog", d)
    }
    getAllLog(player: Socket) {
        player.emit("allLog", this.log);
    }
}