import { MunchkinGame } from "../mucnhkinGame";
import { PlayerGame } from "../player";

export type action_func = (defs: defsData) => void

export class defsData {
    constructor(player?: PlayerGame, game?: MunchkinGame) {
        this.player = player;
        this.game = game;
    }
    player?: PlayerGame
    game?: MunchkinGame
}