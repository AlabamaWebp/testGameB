
import { PlayerGlobal } from "../main";
import { fillId, playersGetCard, shuffle } from "./functions";
import { GameField } from "./interfaces";
import { Socket } from "socket.io";


import { CLASSES } from "src/cards/Munchkin/doors/Classes";
import { COURSES } from "src/cards/Munchkin/doors/Courses";
import { MONSTERS } from "src/cards/Munchkin/doors/Monsters";
import { RASES } from "src/cards/Munchkin/doors/Rases";
import { EQUIPMENT } from "src/cards/Munchkin/treasures/equipment";
import { USED } from "src/cards/Munchkin/treasures/used";
import { COMBAT } from "src/cards/Munchkin/treasures/combat";
import { DoorsCard, PlayerGame, TreasureCard } from "./playerAndCards";

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

    get is_fight() {
        return this.field.fight ? true : false;
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
    /////////
    ///////// картовые
    private openCardField(card: TreasureCard | DoorsCard) {
        if (this.field.fight) this.field.fight = undefined;
        if (!this.field.openCards) this.field.openCards = [card];
        else this.field.openCards.push(card)
    }
    private startFight(player: PlayerGame, monster: DoorsCard) {
        const m_proto = structuredClone(monster) as DoorsCard;
        if (!this.field.fight) this.field.fight = {
            players: {
                main: player
            },
            monsters: [m_proto],
            monstersProto: [monster],
            gold: monster.data.gold,
            pas: new Set<string>
        }
    }
    endFight(client: Socket, smivka: boolean) {
        const pl = this.getPlBySocket(client);
        /// я устал
    }
    yaPas(player: Socket) {
        const name = this.getPlBySocket(player).player.name;
        this.field.fight.pas.add(name)
    }
    popPlayerCard(pl: PlayerGame, card: DoorsCard | TreasureCard): DoorsCard | TreasureCard {
        pl.cards = pl.cards.filter(el => el != card);
        return card;
    }
    cardPlayerById(id: number): DoorsCard | TreasureCard {
        const pl = this.players[this.queue];
        return this.popPlayerCard(pl, pl.cards.find(el => el.id == id));
    }
    private get getDoor() {
        this.checkSbros();
        return this.cards.doors.pop();
    }
    private get getTreasure() {
        this.checkSbros();
        return this.cards.treasures.pop();
    }
    checkSbros() {
        if (this.cards.treasures.length == 0) { this.cards.treasures = this.sbros.treasures.slice(); this.sbros.treasures = []; }
        if (this.cards.doors.length == 0) { this.cards.doors = this.sbros.doors.slice(); this.sbros.doors = []; }
    }
    private getPlBySocket(player: Socket) {
        return this.players.find(el => el.player.socket = player)
    }
    //// Игровые !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    firstStepHod(player: Socket) {
        const pl = this.getPlBySocket(player);
        if (!(this.step == 0 && pl == this.players[this.queue])) return

        const card = this.getDoor;
        this.logging(pl.player.name + " берёт дверь: " + card.abstractData.name + " в открытую");
        if (card.abstractData.cardType == "Монстр") {
            this.logging("Затесалась Драка!!!")
            this.step = 2;
            this.startFight(pl, card);
        }
        else {
            if (card.abstractData.cardType !== "Проклятие")
                pl.cards.push(card);
            else {
                this.logging("Проклятуние")
            } // Проклятуние
            this.step = 1;
            this.openCardField(card);
        }
        this.allPlayersRefresh();
    }
    chistkaNichek(player: Socket) {
        const pl = this.getPlBySocket(player);
        if (this.step == 1 && pl == this.players[this.queue])
            this.playerGetClosedDoor(pl);
    }
    private playerGetClosedDoor(pl: PlayerGame) {
        const card = this.getDoor
        pl.cards.push(card);
        this.logging(pl.player.name + " берёт дверь в закрытую");
        this.onePlayerRefresh(pl);
    }
    private playerGetClosedTreasure(player: Socket, colvo: number) {
        const pl = this.getPlBySocket(player);
        for (let i = 0; i < colvo; i++) {
            const card = this.getTreasure
            pl.cards.push(card);
        }
        this.logging(pl.player.name + " берёт в закрытую сокровищ в количестве " + colvo + "шт.");
        this.onePlayerRefresh(pl);
    }
    private playerGetOpenTreasure(player: Socket) {
        const pl = this.getPlBySocket(player);
        const card = this.getTreasure;
        pl.cards.push(card);
        this.logging(pl.player.name + " берёт сокровище: " + card.abstractData.name + " в открытую");
        this.onePlayerRefresh(pl);
        this.openCardField(card);
    }




    private endHod() {
        this.queue++;
        if (this.queue >= this.plcount)
            this.queue = 0
    }
    //  // Служебные 
    getMainForPlayer(player: PlayerGlobal) {
        const you = this.players.find(el => el.player == player).data;
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
            you: you,
            you_hodish: this.players[this.queue].player == player,
        }
    }
    logging(l: string) {
        l = l.toString();
        l = this.number_log + ". " + l;
        this.number_log++;
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
    allPlayersRefresh() {
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
    // export служебные 
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
}