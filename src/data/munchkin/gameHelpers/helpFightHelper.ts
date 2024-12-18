import { Socket } from "socket.io";
import { MunchkinGame } from "../mucnhkinGame";
import { PlayerGame } from "../player";

export class HelpFightMunchkin {
    constructor(game: MunchkinGame) {
        this.game = game;
    }
    game: MunchkinGame;

    help: Map<PlayerGame, number> = new Map()
    helpAsk(pl: Socket, t: { to: string, gold: number }) {
        if (this.game.field.fight.players.first.player.player.socket != pl) return
        const target = this.game.players.find(el => el.player.name == t.to);
        if (!target) { console.log("helpAsk break"); return }
        this.help.set(target, t.gold);
        console.log(this.help.get(target));
        this.game.Player.onePlayerRefresh(target);
        // target.player.socket.emit("help", ask)
    }
    helpAnswer(socket: Socket, ans: boolean) {
        const pl = this.game.getPlayer(socket);
        const d = this.help.get(pl);
        if (ans) {
            this.game.Fight.addToFight(pl, d);
            this.game.Player.logging(pl.player.name + " помогает в бою за " + d + " сокровищ");
        }
        else this.game.field.fight?.players.first.player.player.socket.emit("notice", "отказ в помощи от " + pl.player.name);
        this.help.delete(pl);
        if (ans) this.game.Player.allPlayersRefresh();
    }
}