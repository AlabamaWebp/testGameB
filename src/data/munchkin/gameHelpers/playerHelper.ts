import { Socket } from "socket.io";
import { Game } from "../mucnhkinGame";
import { PlayerGame } from "../player";

export class PlayerHelper {
    constructor(game: Game) {
        this.game = game;
    }
    game: Game;
    private log: string[] = [];
    private number_log: number = 1;

    getMainForPlayer(player: PlayerGame) {
        let smivka = false;
        const field = this.game.field
        if (field.fight?.players.first.player == player && !field.fight.players.first.smivka) smivka = true;
        if (field.fight?.players.second?.player == player && !field.fight.players.second.smivka) smivka = true;
        const you = this.game.players.find(el => el == player).data;
        const pls = this.game.players
            .filter(el => el != player)
            .map((el: PlayerGame) => el.data)
        return {
            queue: this.game.players[this.game.queue].player.name,
            step: this.game.step,
            // is_fight: this.is_fight,
            field: field.getField,
            sbros:
            {
                doors: this.game.sbros.doors[this.game.sbros.doors.length]?.getData(),
                treasures: this.game.sbros.treasures[this.game.sbros.treasures.length]?.getData(),
            },
            cards: {
                doors: this.game.cards.doors.length,
                treasures: this.game.cards.treasures.length,
            },
            // log: this.log,
            players: pls,
            you: you,
            you_hodish: this.game.players[this.game.queue] == player,
            pas: field.fight?.pas?.has(player.data.name) == false ? true : false,
            smivka: smivka
        }
    }
    logging(l: string) {
        l = l.toString();
        l = this.number_log + ". " + l;
        this.number_log++;
        this.log.unshift(l);
        this.plusLog(l);
    }
    private broadcast(e: string, d: any) { this.game.players.forEach((el: PlayerGame) => { el.player.socket.emit(e, d) }) }
    allPlayersRefresh() { this.game.players.forEach((el: PlayerGame) => { this.broadcast("refreshGame", this.getMainForPlayer(el)) }) }
    onePlayerRefresh(player: PlayerGame) { player.player.socket.emit("refreshGame", this.getMainForPlayer(player)); }
    plusLog(d: string) { this.broadcast("plusLog", d) }
    sendAllLog(player: Socket) { player.emit("allLog", this.log); }
    sendError(pl: Socket, message: string) { pl.send("error", message) }
}