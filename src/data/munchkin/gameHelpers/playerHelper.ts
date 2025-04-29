import { Socket } from "socket.io";
import { MunchkinGame } from "../mucnhkinGame";
import { MunckinPlayerStats, PlayerGame } from "../player";
import { IField, IDoor } from "../interfaces/Game";
import { ITreasure } from "../interfaces/TreasureCard";


export class PlayerHelper {
    constructor(game: MunchkinGame) {
        this.game = game;
    }
    game: MunchkinGame;
    private log: string[] = [];
    private number_log: number = 1;

    getMainForPlayer(player: PlayerGame): MunchkinOutput {
        let smivka = false;
        const field = this.game.field;
        const you_first_fight = field.fight?.players.first.player == player;
        if (you_first_fight && !field.fight.players.first.smivka) smivka = true;
        if (field.fight?.players.second?.player == player && !field.fight.players.second.smivka) smivka = true;
        const you = this.game.players.find(el => el == player).stats(true);
        const pls = this.game.players
            .filter(el => el != player)
            .map((el: PlayerGame) => el.stats())
        const tmp = {
            queue: this.game.players[this.game.queue].player.name,
            step: this.game.step,
            field: field.getField,
            is_fight: this.game.is_fight,
            sbros:
            {
                doors: this.game.sbros.doors.at(-1)?.getData(),
                treasures: this.game.sbros.treasures.at(-1)?.getData(),
            },
            cards: {
                doors: this.game.cards.doors.length,
                treasures: this.game.cards.treasures.length,
            },
            players: pls,
            you: you,
            you_hodish: this.game.players[this.game.queue] == player,
            pas: field.fight?.pas?.has(player.stats().name) == false,
            smivka: smivka,
            rasses_mesto: (!!player.field_cards.doors.rasses.bonus && !!player.field_cards.doors.rasses.first),
            classes_mesto: (!!player.field_cards.doors.classes.bonus && !!player.field_cards.doors.classes.first),
            help_ask: this.game.Event.help.get(player) || this.game.Event.help.get(player) == 0
                ? { pl: player.stats(), gold: this.game.Event.help.get(player) } : undefined,
            is_help: you_first_fight && !field.fight.players.second, // Можно ли позвать на помощь
            end: this.game.endgame
        }
        return tmp
    }
    logging(l: string) {
        l = l.toString();
        l = this.number_log + ". " + l;
        this.number_log++;
        this.log.unshift(l);
        this.plusLog(l);
    }
    private broadcast(e: string, d: any) { this.game.players.forEach((el: PlayerGame) => { el.player.socket.emit(e, d) }) }
    allPlayersRefresh() { this.game.players.forEach((el: PlayerGame) => { el.player.socket.emit("refreshGame", this.getMainForPlayer(el)) }) }
    onePlayerRefresh(player: PlayerGame) { player?.player?.socket?.emit("refreshGame", this.getMainForPlayer(player)); }
    plusLog(d: string) { this.broadcast("plusLog", d) }
    sendAllLog(player: Socket) { player.emit("allLog", this.log); }
    sendError(pl: Socket, message: string) { pl.send("error", message) }
}
export interface MunchkinOutput {
    queue: string;
    step: 0 | 1 | 2 | 3;
    field: IField;
    is_fight: boolean;
    sbros: {
        doors: IDoor;
        treasures: ITreasure;
    };
    cards: {
        doors: number;
        treasures: number;
    };
    players: MunckinPlayerStats[];
    you: MunckinPlayerStats;
    you_hodish: boolean;
    pas: boolean;
    smivka: boolean;
    rasses_mesto: boolean;
    classes_mesto: boolean;
    help_ask: {
        pl: MunckinPlayerStats;
        gold: number;
    }
    is_help: boolean;
    end: boolean;
}