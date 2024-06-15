import { randomInteger } from "./functions";
import { Game } from "./mucnhkinGame";
import { DoorsCard, PlayerGame, TreasureCard } from "./playerAndCards";
import { Socket } from "socket.io";

export class FightHelper {
    constructor(game: Game) {
        this.game = game;
    }
    game: Game;

     startFight(player: PlayerGame, monster: DoorsCard) {
        const m_proto = structuredClone(monster) as DoorsCard;
        if (!this.game.field.fight) this.game.field.fight = {
            players: {
                main: player
            },
            monsters: [m_proto],
            monstersProto: [monster],
            gold: monster.data.gold,
            lvls: m_proto.data.get_lvls,
            pas: new Set<string>,

            monsters_power: m_proto.data.strongest,
            players_power: player.power,

            gold_first_pl: monster.data.gold,
            gold_second_pl: 0,

            smivka: false,
            smivka_first: 0,
            smivka_second: 0,
        }
    }
    endFight(client: Socket) {
        const pl = this.game.getPlBySocket(client);
        if (!pl) return
        if (this.game.field.fight?.pas.size == (this.game.plcount - 1)) { // все пасанули
            const monsters = this.game.field.fight.monsters;
            const f = this.game.field.fight;
            if (f.players_power > f.monsters_power) { // Победа игрока
                this.game.Card.playerGetClosedTreasure(f.players.main, f.gold_first_pl);
                f.players.main.changeLvl(f.lvls);
            }
            else { // победа монстров
                if (f.smivka) {

                }
            }
            // НАдо подумать над применяемыми картами во время боя
        }
        else {
            this.game.Player.sendError(pl.player.socket, "Не все пасанули");
        }
    }
    kidokSmivka(client: Socket) {
        const pl = this.game.getPlBySocket(client);
        const f = this.game.field.fight;
        if (!pl || !f) return;

        let templ: 0 | 1 | 2 = 0; // 0 - net na pole; 1 - first, 2 - second;
        if (f.players.main == pl) templ = 1;
        else if (f.players.secondary == pl) templ = 2
        if (templ == 1 || templ == 2) {
            f.smivka == true;
            // this.cubik = randomInteger(1, 6);
            if (templ == 1 && f.smivka_first == 0)
                f.smivka_first = randomInteger(1, 6)
            else if (templ == 2 && f.smivka_second == 0)
                f.smivka_second = randomInteger(1, 6);
            this.game.Player.logging(pl.data.name + "выбрасывает " + this.game.cubik + " на кубике")
            this.game.Player.allPlayersRefresh();
        }
    }
    yaPas(player: Socket) {
        const name = this.game.getPlBySocket(player).player.name;
        this.game.field.fight.pas.add(name);
    }
}