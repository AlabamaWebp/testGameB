import { DoorsCard, Game, PlayerGame, TreasureCard } from "../mucnhkin";

export interface DoorsDefs {
    punishment?: (defs: defsData) => void,
    startActions?: (defs: defsData) => void,
    winActions?: (defs: defsData) => void,
    beforeSmivka?: (defs: defsData) => void,
    action?: (defs: defsData) => void,
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}
export interface MonsterData {
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
    defs?: TreasureDefs | undefined
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
export interface gameField {
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
        treasures: number
    }
    openCards?: (TreasureCard | DoorsCard)[]
}