import { Socket } from "socket.io";
import { Game } from "../mucnhkinGame";

export class HelpFightMunchkin {
    constructor(game: Game) {
        this.game = game;
    }
    game: Game;

    help = new Map()
    helpAsk(pl: Socket, t: { to: string, gold: number }) {
        if (this.game.field.fight.players.first.player.player.socket != pl) return
        const target = this.game.players.find(el => el.player.name == t.to);
        if (!target) { console.log("helpAsk break"); return }
        const ask = this.help.set(target, t.gold);
        this.game.Player.onePlayerRefresh(target);
        // target.player.socket.emit("help", ask)
    }
    helpAnswer(socket: Socket, ans: boolean) {
        const pl = this.game.getPlayer(socket);
        const d = this.help.get(pl);
        if (ans) {
            this.game.Fight.addToFight(pl, d.gold);
            this.game.Player.logging(pl.player.name + " помогает в бою за " + d.gold + " сокровищ");
        }
        else this.game.field.fight?.players.first.player.player.socket.emit("notice", "отказ в помощи от " + pl.player.name);
        this.help.delete(pl);
    }
}