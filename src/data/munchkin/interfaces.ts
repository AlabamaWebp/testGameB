import { DoorsCard, Game, PlayerGame, TreasureCard } from "../mucnhkin";

export interface DoorsDefs {
    punishment?: (defs: defsData) => void,
    startActions?: (defs: defsData) => void,
    winActions?: (defs: defsData) => void,
    beforeSmivka?: (defs: defsData) => void,
    action?: (defs: defsData) => void,
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}
export class MonsterData {
    lvl: number;
    strongest: number;
    gold: number;
    undead: boolean;
}

export interface TreasureData {
    treasureType: "Надеваемая" | "Используемая" | "Боевая"

    template?: "Шлем" | "Броник" | "Ноги" | "Рука"
    | "2 Руки" | "3 Руки" | "Рядом" | undefined

    cost?: number | undefined
    big?: boolean | undefined
}
export interface TreasureDefs {
    condition?: (defs: defsData) => boolean
    action?: (defs: defsData) => void
}

export interface AbstractData {
    name: string;
    description: string;
    cardType: "Класс" | "Раса" | "Проклятие" | "Монстр" | "Сокровище"
    img?: string;
}

export interface fieldTreasureCards {
    helmet?: TreasureCard[]
    body?: TreasureCard[]
    legs?: TreasureCard[]
    arm?: TreasureCard[]
    other?: TreasureCard[]
}
export interface fieldDoorCards {
    rasses?: DoorsCard[]
    classes?: DoorsCard[]
}
export interface defsData {
    player?: PlayerGame
    game?: Game
}
export class GameField {
    fight?: {
        players: {
            main: PlayerGame,
            secondary?: PlayerGame
        }
        cards?: {
            players?: (TreasureCard | DoorsCard)[],
            monsters?: (TreasureCard | DoorsCard)[]
        }
        monsters: DoorsCard[]
        monstersProto: DoorsCard[]
        gold: number
    }
    openCards?: (TreasureCard | DoorsCard)[] = []

    get getField() {
        return {
            is_fight: this.fight ? true : false,
            fight: {
                players: {
                    main: this.fight?.players?.main?.data,
                    secondary: this.fight?.players?.secondary?.data,
                    strongest: 1 ///
                },
                cards: {
                    players: this.fight?.cards?.players?.map(el => el.getData()),
                    monsters: this.fight?.cards?.monsters?.map(el => el.getData())
                },
                monsters: this.fight?.monsters?.map(el => el.getData()),
                monsterStrongest: 1, ///
                treasures: this.fight?.gold,
                lvls: 1 ///
            },
            openCards: this.openCards?.map(el => el.getData())
        }
    }
}