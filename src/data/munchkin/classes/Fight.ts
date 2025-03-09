import { PlayerGame } from "../player";
import { DoorCard } from "./DoorCard";
import { TreasureCard } from "./TreasureCard";

export class Fight {
    constructor(pl: PlayerGame, monster: DoorCard) {
        const m_ = monster.clone()

        this.pas = new Set<string>();
        this.lvls = m_.monster.get_lvls;
        this.monsters_power = m_.monster.strongest;
        this.monstersProto = [monster];
        this.monsters = [m_];
        this.gold = monster.monster.gold;
        this.players_power = pl.power;
        this.smivka = false;
        this.players = {
            first: {
                player: pl,
                gold: monster.monster.gold,
                smivka: false
            }
        }
    }
    players: {
        first: PlayerFight,
        second?: PlayerFight
    }
    cards: {
        players?: (TreasureCard | DoorCard)[],
        monsters?: (TreasureCard | DoorCard)[]
    } = {
            players: [],
            monsters: []
        }
    pas: Set<string>;
    monsters: DoorCard[] // Мутируемые монстры
    monstersProto: DoorCard[] // Не трогать, класс в игре используется
    gold: number;
    lvls: number;

    monsters_power: number;
    players_power: number;

    smivka: boolean;
}
interface PlayerFight {
    player: PlayerGame
    gold: number
    smivka: boolean
}