import { Game } from "./mucnhkinGame";
import { DoorsCard, PlayerGame, TreasureCard } from "./playerAndCards";

export interface DoorsDefs {
    punishment?: (defs: defsData) => void,
    startActions?: (defs: defsData) => void,
    winActions?: (defs: defsData) => void,
    beforeSmivka?: (defs: defsData) => void,
    action?: (defs: defsData) => void,
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}
export class MonsterData {
    get_lvls: number; // 
    strongest: number;
    gold: number;
    undead: boolean;
}

export interface TreasureData {
    treasureType: "Надеваемая" | "Используемая" | "Боевая"

    template?: "Шлем" | "Броник" | "Ноги" | "Рука"
    | "2 Руки" | "3 Руки" | "Рядом"

    cost?: number
    big?: boolean
}
export interface TreasureDefs {
    condition?: (defs: defsData) => boolean
    action?: (defs: defsData) => void
    log_txt?: string
}

export interface AbstractData {
    name: string;
    description: string;
    cardType: "Класс" | "Раса" | "Проклятие" | "Монстр" | "Сокровище"
    img?: string;
}

export class fieldTreasureCards {
    helmet: TreasureCard[] = []
    body: TreasureCard[] = []
    legs: TreasureCard[] = []
    arm: TreasureCard[] = []
    other: TreasureCard[] = []
    count = {
        "helmet": 1,
        "body": 1,
        "legs": 1,
        "arm": 2,
    }
}
export class fieldDoorCards {
    rasses = {
        first: undefined,
        second: undefined,
        bonus: undefined,
    }
    classes = {
        first: undefined,
        second: undefined,
        bonus: undefined,
    }
    getClasses() {
        const tmp: any = {}
        if (this.classes.first) tmp.first = (this.classes.first)
        if (this.classes.second) tmp.second = (this.classes.second)
        if (this.classes.bonus) tmp.bonus = (this.classes.bonus)
        return tmp;
    }
    getRasses() {
        const tmp: any = {}
        if (this.rasses.first) tmp.first = (this.rasses.first)
        if (this.rasses.second) tmp.second = (this.rasses.second)
        if (this.rasses.bonus) tmp.bonus = (this.rasses.bonus)
        return tmp;
    }
    getRasesMass() {
        const tmp: DoorsCard[] = []
        if (this.rasses.first) tmp.push(this.rasses.first)
        if (this.rasses.second) tmp.push(this.rasses.second)
        if (this.rasses.bonus) tmp.push(this.rasses.bonus)
        return tmp;
    }
    getClassesMass() {
        const tmp: DoorsCard[] = []
        if (this.classes.first) tmp.push(this.classes.first)
        if (this.classes.second) tmp.push(this.classes.second)
        if (this.classes.bonus) tmp.push(this.classes.bonus)
        return tmp;
    }
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
        pas?: Set<string>;
        monsters: DoorsCard[]
        monstersProto: DoorsCard[]
        gold: number;
    }
    openCards?: (TreasureCard | DoorsCard)[] = []

    get getField() {
        const pl_power = this.fight?.players.main.power + this.fight?.players?.secondary?.power ?? 0;
        let m_power = 0;
        this.fight?.monsters.forEach(el => m_power += el.data.strongest ?? 0);
        let m_lvls = 0;
        this.fight?.monsters.forEach(el => m_power += el.data.get_lvls ?? 0);
        return {
            is_fight: this.fight ? true : false,
            fight: this.fight ? {
                players: {
                    main: this.fight?.players?.main?.data,
                    secondary: this.fight?.players?.secondary?.data,
                    strongest: pl_power ///
                },
                cards: {
                    players: this.fight?.cards?.players?.map(el => el.getData()),
                    monsters: this.fight?.cards?.monsters?.map(el => el.getData())
                },
                monsters: this.fight?.monsters?.map(el => el.getData()),
                monsterStrongest: m_power, ///
                treasures: this.fight?.gold,
                lvls: m_lvls ///
            } : undefined,
            openCards: this.openCards?.map(el => el.getData())
        }
    }
}