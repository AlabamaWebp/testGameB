import { shuffle } from "../functions";
import { MunchkinGame } from "../mucnhkinGame";
import { DoorCard, TreasureCard } from "../cards";
import { Socket } from "socket.io";
import { PlayerGame } from "../player";
export class CardHelper {
    constructor(game: MunchkinGame) {
        this.game = game;
    }
    game: MunchkinGame;

    openCardField(card: TreasureCard | DoorCard) {
        if (this.game.field.fight) this.game.field.fight = undefined;
        if (!this.game.field.openCards) this.game.field.openCards = [card];
        else this.game.field.openCards.push(card)
    }
    popPlayerCard(pl: PlayerGame, card: DoorCard | TreasureCard): DoorCard | TreasureCard {
        pl.cards = pl.cards.filter(el => el != card);
        return card;
    }
    cardPlayerById(id: number): DoorCard | TreasureCard {
        const pl = this.game.players[this.game.queue];
        return this.popPlayerCard(pl, pl.cards.find(el => el.id == id));
    }
    get getDoor(): DoorCard | undefined {
        this.checkSbros();
        const tmp: DoorCard | undefined = this.game.cards.doors.pop();
        if (!tmp) this.game.Player.logging("Карты дверей - всё")
        return tmp;
    }
    get getTreasure(): TreasureCard | undefined {
        this.checkSbros();
        const tmp: TreasureCard | undefined = this.game.cards.treasures.pop();
        if (!tmp) this.game.Player.logging("Карты сокровищ - всё")
        return tmp;
    }
    checkSbros() {
        if (this.game.cards.treasures.length == 0) {
            this.game.cards.treasures = shuffle(this.game.sbros.treasures.slice());
            this.game.sbros.treasures = [];
        }
        if (this.game.cards.doors.length == 0) {
            this.game.cards.doors = shuffle(this.game.sbros.doors.slice());
            this.game.sbros.doors = [];
        }
    }
    playerGetClosedDoor(pl: PlayerGame) {
        const card = this.getDoor
        pl.cards.push(card);
        this.game.Player.logging(pl.player.name + " берёт дверь в закрытую");
        this.game.Player.onePlayerRefresh(pl);
    }
    playerGetClosedTreasure(pl: PlayerGame, colvo: number) {
        for (let i = 0; i < colvo; i++) {
            const card = this.getTreasure
            pl.cards.push(card);
            this.game.Player.logging(pl.player.name + " берёт в закрытую сокровищ в количестве " + colvo + "шт.");
            this.game.Player.onePlayerRefresh(pl);
        }
    }
    playerGetOpenTreasure(player: Socket) {
        const pl = this.game.getPlayer(player);
        const card = this.getTreasure;
        pl.cards.push(card);
        this.game.Player.logging(pl.player.name + " берёт сокровище: " + card.abstractData.name + " в открытую");
        this.game.Player.onePlayerRefresh(pl);
        this.openCardField(card);
    }
    toSbros(card: TreasureCard | DoorCard) {
        if (card instanceof TreasureCard)
            this.game.sbros.treasures.push(card)
        else if (card instanceof DoorCard)
            this.game.sbros.doors.push(card)
        else return
        this.checkSbros();
    }

}
