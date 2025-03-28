
import { fillId, playersGetCard, shuffle } from "./functions";
import { Socket } from "socket.io";
import { CLASSES } from "src/cards/Munchkin/doors/Classes";
import { COURSES } from "src/cards/Munchkin/doors/Courses";
import { MONSTERS } from "src/cards/Munchkin/doors/Monsters";
import { RASES } from "src/cards/Munchkin/doors/Rases";
import { EQUIPMENT } from "src/cards/Munchkin/treasures/Equipment";
import { USED } from "src/cards/Munchkin/treasures/Used";
import { COMBAT } from "src/cards/Munchkin/treasures/Combat";
import { CardHelper } from "./gameHelpers/cardHelper";
import { PlayerHelper } from "./gameHelpers/playerHelper";
import { ActionHelper } from "./gameHelpers/actionHelper";
import { FightHelper } from "./gameHelpers/fightHelper";
import { PlayerGame } from "./player";
import { HelpFightMunchkin } from "./gameHelpers/helpFightHelper";
import { DoorCard } from "./classes/DoorCard";
import { GameField } from "./classes/GameField";
import { TreasureCard } from "./classes/TreasureCard";

export class MunchkinGame {
    constructor(name: string, players: PlayerGame[]) {
        this.name = name;
        this.players = shuffle(players);
        this.current_player = players[0];
        this.plcount = players.length;
        this.Player.logging("Игра началась!");
        this.cards = {
            doors: (shuffle(CLASSES.concat(COURSES).concat(MONSTERS).concat(RASES))).map(e => { e.game = this; return e }),
            treasures: (shuffle(EQUIPMENT.concat(USED).concat(COMBAT))).map(e => { e.game = this; return e })
        }
        // this.cards_copy = {
        //     doors: this.cards.doors.slice(),
        //     treasures: this.cards.treasures.slice()
        // }
        fillId.call(this);
        playersGetCard.call(this);
    }
    endgame = false

    plcount: number;
    name: string;
    players: PlayerGame[];
    current_player: PlayerGame;

    // cards_copy: { doors: DoorCard[], treasures: TreasureCard[] };
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