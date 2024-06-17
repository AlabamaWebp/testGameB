import { shuffle } from "../functions";
import { Game } from "../mucnhkinGame";
import { DoorsCard, PlayerGame, TreasureCard } from "../playerAndCards";
import { Socket } from "socket.io";
export class CardHelper {
    constructor(game: Game) {
        this.game = game;
    }
    game: Game;

    openCardField(card: TreasureCard | DoorsCard) {
        if (this.game.field.fight) this.game.field.fight = undefined;
        if (!this.game.field.openCards) this.game.field.openCards = [card];
        else this.game.field.openCards.push(card)
    }
    popPlayerCard(pl: PlayerGame, card: DoorsCard | TreasureCard): DoorsCard | TreasureCard {
        pl.cards = pl.cards.filter(el => el != card);
        return card;
    }
    cardPlayerById(id: number): DoorsCard | TreasureCard {
        const pl = this.game.players[this.game.queue];
        return this.popPlayerCard(pl, pl.cards.find(el => el.id == id));
    }
    get getDoor() {
        this.checkSbros();
        return this.game.cards.doors.pop();
    }
    get getTreasure() {
        this.checkSbros();
        return this.game.cards.treasures.pop();
    }
    checkSbros() {
        if (this.game.cards.treasures.length == 0) { this.game.cards.treasures = this.game.sbros.treasures.slice(); this.game.sbros.treasures = []; }
        if (this.game.cards.doors.length == 0) { this.game.cards.doors = this.game.sbros.doors.slice(); this.game.sbros.doors = []; }
    }
    playerGetClosedDoor(pl: PlayerGame) {
        const card = this.getDoor
        pl.cards.push(card);
        this.game.Player.logging(pl.player.name + " берёт дверь в закрытую");
        this.game.Player.onePlayerRefresh(pl);
    }
    playerGetClosedTreasure(pl: PlayerGame, colvo: number) {
        // const pl = this.getPlBySocket(player);
        for (let i = 0; i < colvo; i++) {
            const card = this.getTreasure
            pl.cards.push(card);
        }
        this.game.Player.logging(pl.player.name + " берёт в закрытую сокровищ в количестве " + colvo + "шт.");
        this.game.Player.onePlayerRefresh(pl);
    }
    playerGetOpenTreasure(player: Socket) {
        const pl = this.game.getPlayer(player);
        const card = this.getTreasure;
        pl.cards.push(card);
        this.game.Player.logging(pl.player.name + " берёт сокровище: " + card.abstractData.name + " в открытую");
        this.game.Player.onePlayerRefresh(pl);
        this.openCardField(card);
    }
    toSbros(card: TreasureCard | DoorsCard) {
        if (card instanceof TreasureCard) {
            this.game.sbros.treasures.push(card)
        }
        else if (card instanceof DoorsCard) {
            this.game.sbros.doors.push(card)
        }
        else return
        if (!this.game.cards.doors.length) {
            this.game.cards = shuffle(this.game.sbros.doors.slice());
            this.game.sbros.doors = []
        }
        else if (!this.game.cards.treasures.length) {
            if (!this.game.cards.treasures.length) {
                this.game.cards = shuffle(this.game.sbros.treasures.slice());
                this.game.sbros.treasures = []
            }
        }
    }
}