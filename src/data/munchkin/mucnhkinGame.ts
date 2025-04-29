
import { fillId, playersGetCard, shuffle } from "./functions";
import { Socket } from "socket.io";
import { CardHelper } from "./gameHelpers/cardHelper";
import { PlayerHelper } from "./gameHelpers/playerHelper";
import { ActionHelper } from "./gameHelpers/actionHelper";
import { FightHelper } from "./gameHelpers/fightHelper";
import { PlayerGame } from "./player";
import { HelpFightMunchkin } from "./gameHelpers/helpFightHelper";
import { DoorCard } from "./interfaces/DoorCard";
import { GameField } from "./interfaces/Game";
import { TreasureCard } from "./interfaces/TreasureCard";
import { CARDS } from "src/cards/Munchkin/json/cards";

export class MunchkinGame {
    constructor(name: string, players: PlayerGame[]) {
        this.name = name;
        this.players = shuffle(players);
        this.current_player = players[0];
        this.plcount = players.length;
        this.Player.logging("Игра началась!");
        this.cards = {
            doors: (shuffle(CARDS.Doors)).map(e => { e.game = this; return e }),
            treasures: (shuffle(CARDS.Golds)).map(e => { e.game = this; return e })
        }
        fillId.call(this);
        playersGetCard.call(this);
    }
    endgame = false;

    plcount: number;
    name: string;
    players: PlayerGame[];
    current_player: PlayerGame;

    cards: { doors: DoorCard[], treasures: TreasureCard[] };
    sbros: { doors: DoorCard[], treasures: TreasureCard[] } = { doors: [], treasures: [] };
    step: 0 | 1 | 2 | 3 = 0; // перед боем | чистка нычек | бой | после боя
    queue: number = 0;
    cubik: number = 1;

    field: GameField = new GameField();
    Card: CardHelper = new CardHelper(this);
    Player: PlayerHelper = new PlayerHelper(this);
    Fight: FightHelper = new FightHelper(this);
    Action: ActionHelper = new ActionHelper(this);
    Event: HelpFightMunchkin = new HelpFightMunchkin(this)

    get is_fight() { return !!this.field.fight }

    getPlayer(player: Socket) {
        const pl = this.players.find(el => el.player.socket == player)
        return pl
    }
}