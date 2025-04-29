import { randomInteger } from "../functions";
import { Socket } from "socket.io";
import { PlayerGame } from "../player";
import { MunchkinGame } from "../mucnhkinGame";
import { DoorCard } from "../interfaces/DoorCard";
import { Fight } from "../interfaces/Game";
import { TreasureCard } from "../interfaces/TreasureCard";

export class FightHelper {
    constructor(game: MunchkinGame) {
        this.game = game;
    }
    game: MunchkinGame;
    get fight() { return this.game.field.fight }
    startFight(player: PlayerGame, monster: DoorCard) { if (!this.fight) this.game.field.fight = new Fight(player, monster); this.game.field.openCards = [] }
    endFight() {
        if (this.fight?.pas.size == this.game.plcount) { // все пасанули
            const monsters = this.fight.monsters;
            const f = this.fight;
            const players = [f.players.first]
            if (f.players.second) players.push(f.players.second);
            if (f.smivka) {
                for (let i = 0; i < players.length; i++) {
                    const pl = players[i];
                    if (pl.player.cubik > pl.player.smivka_power) {
                        this.game.Player.logging(pl.player.stats().name + " успешно сбегает!");
                        players.splice(i, 1);
                    }
                }
            }
            if (players.length) {
                if (!f.smivka && f.players_power > f.monsters_power) { // Победа игрока (надо делить сокровища)
                    this.game.Card.playerGetClosedTreasure(f.players.first.player, f.gold);
                    f.players.first.player.changeLvl(f.lvls, true);
                    if (f.players.second)
                        this.game.Card.playerGetClosedTreasure(f.players.second.player, f.gold);
                }
                else { // победа монстров
                    let tmp = ""
                    monsters.forEach(m => {
                        players.forEach(p => {
                            if (m.defs.punishment)
                                m.defs.punishment({ player: p.player, game: this.game });
                            else console.log("Нет наказания");
                            tmp += p.player.stats().name + " наказан " + m.abstractData.name + "\n"
                        })
                    })
                    this.game.Player.logging(tmp);
                }
            }
            this.fight.monsters.forEach(el => this.game.Card.toSbros(el));
            delete this.game.field.fight;
            this.game.Action.setStep3();
            // НАдо подумать над применяемыми картами во время боя
        }
    }
    kidokSmivka(client: Socket) {
        const pl = this.game.getPlayer(client);
        const f = this.game.field.fight;
        if (!pl || !f || f.smivka) return;

        let templ: undefined | "first" | "second"; // 0 - net na pole; 1 - first, 2 - second;
        if (f.players.first.player == pl) templ = "first";
        else if (f.players.second.player == pl) templ = "second"
        if (templ) {
            f.smivka = true;
            f.players[templ].smivka = true;
            pl.cubik = randomInteger(1, 6);
            f["smivka_" + templ] = true;
            this.game.Player.logging(pl.stats().name + " выбрасывает " + pl.cubik + " на кубике")
            this.game.Player.onePlayerRefresh(pl);
            // this.game.Player.allPlayersRefresh();
        }
    }
    yaPas(player: Socket) {
        const name = this.game.getPlayer(player).player.name;
        this.fight.pas.add(name);
        if (this.fight.pas.size == this.game.plcount)
            this.endFight();
        this.game.Player.allPlayersRefresh();
    }
    addToFight(pl: PlayerGame, gold: number) {
        if (this.fight.players.second) return;
        this.fight.players.second = {
            player: pl,
            gold: gold,
            smivka: false
        }
        this.refreshFight()
    }
    refreshFight() {
        let gold = 0;
        let power = 0;
        this.fight.monsters.forEach(e => {
            power += e.monster.strongest;
            gold += e.monster.gold;
        });
        this.fight.cards.monsters.forEach(el => {
            if (el instanceof TreasureCard && el.data.treasureType == "Боевая")
                power += el.strong;
        })
        this.fight.monsters_power = power;
        this.fight.gold = gold;

        power = this.fight.players.first.player.power;
        power += this.fight.players.second?.player.power ?? 0;
        this.fight.cards.players.forEach(el => {
            if (el instanceof TreasureCard && el.data.treasureType == "Боевая")
                power += el.strong;
        })
        this.fight.players_power = power;
    }
}