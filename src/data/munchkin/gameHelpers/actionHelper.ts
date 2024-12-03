import { MunchkinGame } from "../mucnhkinGame";
import { Socket } from "socket.io";
import { PlayerGame } from "../player";

export class ActionHelper {
    constructor(game: MunchkinGame) {
        this.game = game;
    }
    game: MunchkinGame;
    getDoorCardByPlayer(player: Socket) {
        const pl = this.game.getPlayer(player);
        if (pl != this.game.players[this.game.queue]) return;
        if (this.game.step == 0) this.firstStepHod(pl);
        else if (this.game.step == 1) this.chistkaNichek(pl);
    }
    firstStepHod(pl: PlayerGame) {
        const card = this.game.Card.getDoor;
        if (card) {
            this.game.Player.logging(pl.player.name + " берёт дверь: " + card.abstractData.name + " в открытую");
            if (card.abstractData.cardType == "Монстр") {
                this.game.Player.logging("Затесалась Драка!!!")
                this.game.step = 2;
                this.game.Fight.startFight(pl, card);
            }
            else {
                if (card.abstractData.cardType !== "Проклятие")
                    pl.cards.push(card);
                else
                    card.defs.action(pl.defsForCard);
                this.game.step = 1;
                this.game.Card.openCardField(card);
            }
            this.game.Player.allPlayersRefresh();
        }
        else {
            console.log("Нет карты");
            this.game.Player.logging("Нет карт в колоде");
        }
    }
    chistkaNichek(pl: PlayerGame) {
        if (this.game.step == 1 && pl == this.game.players[this.game.queue]) {
            this.game.Card.playerGetClosedDoor(pl);
            this.setStep3();
            this.game.Player.onePlayerRefresh(pl);
        }
    }
    setStep3() {
        this.game.step = 3;
        this.game.Player.logging("Игрок может завершить ход если у него не больше " + this.game.current_player.stats().max_cards + " карт")
    }
    endHod(pl: PlayerGame) {
        if (pl == this.game.current_player) {
            if (pl.stats().max_cards < pl.cards.length) return;
            this.game.Player.logging(this.game.current_player.stats().name + " закончил свой ход")
            this.game.current_player.coins = 0;
            this.game.queue++;
            if (this.game.queue >= this.game.plcount)
                this.game.queue = 0
            this.game.current_player = this.game.players[this.game.queue]
            this.game.step = 0;
            this.game.Player.logging("Ход игрока " + this.game.current_player.stats().name)
            this.game.Player.allPlayersRefresh();
        }
    }
}