import { randomInteger } from "./functions";
import { Fight } from "./interfaces";
import { Game } from "./mucnhkinGame";
import { DoorsCard, PlayerGame, TreasureCard } from "./playerAndCards";
import { Socket } from "socket.io";

export class FightHelper {
    constructor(game: Game) {
        this.game = game;
    }
    game: Game;

    startFight(player: PlayerGame, monster: DoorsCard) { if (!this.game.field.fight) this.game.field.fight = new Fight(player, monster) }
    endFight() {
        if (this.game.field.fight?.pas.size == this.game.plcount) { // все пасанули
            const monsters = this.game.field.fight.monsters;
            const f = this.game.field.fight;
            if (f.smivka) {
                const pl1 = f.players.main;
                if (pl1.cubik > pl1.smivka_power)
                    this.game.Player.logging(pl1.data.name + " успешно сбегает!")
                const pl2 = f.players.secondary;
                if (pl2?.cubik > pl2?.smivka_power)
                    this.game.Player.logging(pl2.data.name + " успешно сбегает!")
            }
            else if (f.players_power > f.monsters_power) { // Победа игрока
                this.game.Card.playerGetClosedTreasure(f.players.main, f.gold_first_pl);
                f.players.main.changeLvl(f.lvls);
            }
            else { // победа монстров

            }
            // НАдо подумать над применяемыми картами во время боя
        }
    }
    kidokSmivka(client: Socket) {
        const pl = this.game.getPlayer(client);
        const f = this.game.field.fight;
        if (!pl || !f) return;

        let templ: undefined | "first" | "second"; // 0 - net na pole; 1 - first, 2 - second;
        if (f.players.main == pl) templ = "first";
        else if (f.players.secondary == pl) templ = "second"
        if (templ) {
            f.smivka = true;
            pl.cubik = randomInteger(1, 6);
            f["smivka_" + templ] = true;
            this.game.Player.logging(pl.data.name + "выбрасывает " + this.game.cubik + " на кубике")
            // this.game.Player.allPlayersRefresh();
        }
    }
    yaPas(player: Socket) {
        const name = this.game.getPlayer(player).player.name;
        this.game.field.fight.pas.add(name);
        if (this.game.field.fight.pas.size == this.game.plcount)
            this.endFight();
        this.game.Player.allPlayersRefresh();
    }
}