import { MunckinPlayerStats, PlayerGame } from "../player";
import { AbstractData } from "./AbstractCard";
import { DoorCard, MonsterData } from "./DoorCard";
import { TreasureCard, ITreasure } from "./TreasureCard";

export class GameField {
    fight?: Fight
    openCards?: (TreasureCard | DoorCard)[] = []

    get getField(): IField {
        const pl_power = this.fight?.players_power;
        let m_power = this.fight?.monsters_power;
        let m_lvls = this.fight?.lvls;

        // this.fight?.players.main.power + this.fight?.players?.secondary?.power ?? 0;
        // this.fight?.monsters.forEach(el => m_power += el.data.strongest ?? 0);
        // this.fight?.monsters.forEach(el => m_power += el.data.get_lvls ?? 0);
        return {
            is_fight: !!this.fight,
            fight: this.fight ? {
                players: {
                    main: {
                        player: this.fight?.players?.first?.player.stats(),
                        gold: this.fight?.players?.first?.gold,
                        smivka: this.fight?.players?.first?.smivka
                    },
                    secondary: {
                        player: this.fight?.players?.second?.player?.stats(),
                        gold: this.fight?.players?.second?.gold,
                        smivka: this.fight?.players?.second?.smivka
                    },
                    strongest: pl_power ///
                },
                cards: {
                    players: this.fight?.cards?.players?.map(el => el.getData()),
                    monsters: this.fight?.cards?.monsters?.map(el => el.getData())
                },
                monsters: this.fight?.monsters?.map(el => el?.getData()),
                monsterStrongest: m_power, ///
                gold: this.fight?.gold,
                lvls: m_lvls ///
            } : undefined,
            openCards: this.openCards?.map(el => el.getData())
        }
    }
}
export interface IField {
    is_fight: boolean;
    fight: {
        players: {
            main: {
                player: MunckinPlayerStats;
                gold: number;
                smivka: boolean;
            };
            secondary: {
                player: MunckinPlayerStats;
                gold: number;
                smivka: boolean;
            };
            strongest: number;
        };
        cards: {
            players: (IDoor | ITreasure)[];
            monsters: (IDoor | ITreasure)[];
        };
        monsters: IDoor[];
        monsterStrongest: number;
        gold: number;
        lvls: number;
    };
    openCards: (IDoor | ITreasure)[];
}
export interface IDoor {
    abstractData: AbstractData;
    data: MonsterData;
    id: number;
    is_super: boolean;
    use: boolean;
}



interface PlayerFight {
    player: PlayerGame
    gold: number
    smivka: boolean
}
export class Fight {
    constructor(pl: PlayerGame, monster: DoorCard) {
        const m_ = monster.clone(monster)

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