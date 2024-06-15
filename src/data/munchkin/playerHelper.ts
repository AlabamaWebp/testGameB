import { Socket } from "socket.io";
import { PlayerGlobal } from "../main";
import { Game } from "./mucnhkinGame";
import { PlayerGame } from "./playerAndCards";

export class PlayerHelper {
    constructor(game: Game) {
        this.game = game;
    }
    game: Game;
    private log: string[] = [];
    private number_log: number = 1;

    getMainForPlayer(player: PlayerGlobal) {
        const you = this.game.players.find(el => el.player == player).data;
        const pls = this.game.players
            .filter(el => el.player != player)
            .map((el: PlayerGame) => el.data)
        return {
            queue: this.game.players[this.game.queue].player.name,
            step: this.game.step,
            // is_fight: this.is_fight,
            field: this.game.field.getField,
            sbros:
            {
                doors: this.game.sbros.doors[this.game.sbros.doors.length]?.getData(),
                treasures: this.game.sbros.treasures[this.game.sbros.treasures.length]?.getData()
            },
            // log: this.log,
            players: pls,
            you: you,
            you_hodish: this.game.players[this.game.queue].player == player,
        }
    }
    logging(l: string) {
        l = l.toString();
        l = this.number_log + ". " + l;
        this.number_log++;
        this.log.push(l);
        this.plusLog(l);
    }
    logQueue() {
        const name = this.game.players[this.game.queue].player.name;
        this.logging("Ход игрока: " + name + " ")
    }
    broadcast(e: string, d: any) {
        this.game.players.forEach((el: PlayerGame) => {
            el.player.socket.emit(e, d)
        })
    }
    allPlayersRefresh() {
        this.game.players.forEach((el: PlayerGame) => {
            this.broadcast("refreshGame", this.getMainForPlayer(el.player))
        })
    }
    onePlayerRefresh(player: PlayerGame) { player.player.socket.emit("refreshGame", this.getMainForPlayer(player.player)); }
    plusLog(d: string) { this.broadcast("plusLog", d) }
    sendAllLog(player: Socket) { player.emit("allLog", this.log); }
    sendError(pl: Socket, message: string) { pl.send("error", message) }
}