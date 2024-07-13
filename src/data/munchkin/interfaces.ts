import { Game } from "./mucnhkinGame";
import { DoorsCard, TreasureCard } from "./cards";
import { PlayerGame } from "./player";

export interface DoorsDefs {
    punishment?: (defs: defsData) => void, // видимо непотребство
    startActions?: (defs: defsData) => void, // 
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
    findAndDel(id: number): TreasureCard | undefined {
        const f = [this.helmet,
        this.body,
        this.legs,
        this.arm,]
        return findInMassAndDelete(id, f) as TreasureCard
    }
}
interface _fieldDoorCards {
    first: DoorsCard | undefined,
    second: DoorsCard | undefined,
    bonus: DoorsCard | undefined,
}
export class fieldDoorCards {
    rasses: _fieldDoorCards = {
        first: undefined,
        second: undefined,
        bonus: undefined,
    }
    classes: _fieldDoorCards = {
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
    findAndDel(id: number): DoorsCard | undefined {
        const t = ['first', 'second', 'bonus',]
        for (const i of t) {
            const r = this.rasses[i]
            const c = this.classes[i]
            if (r?.id == id) {
                const tmp = r
                delete this.rasses[i]
                return tmp
            }
            if (c?.id == id) {
                const tmp = c
                delete this.classes[i]
                return tmp
            }
        } /// это надо переписать
    }
}
function findInMassAndDelete(id: number, f: DoorsCard[][] | TreasureCard[][]) {
    const tmp = f.find(el => el.find(e => e.id == id));
    if (!tmp) return
    const ret = tmp.find(e => e.id == id);
    //@ts-ignore
    tmp.splice(tmp.indexOf(ret), 1)
    return ret
}
export interface defsData {
    player?: PlayerGame
    game?: Game
}
interface PlayerFight {
    player: PlayerGame
    gold: number
    smivka: boolean
}
export class Fight {
    constructor(pl: PlayerGame, monster: DoorsCard) {
        const m_ = monster.clone(monster)

        this.pas = new Set<string>();
        this.monsters = [m_];
        this.lvls = m_.data.get_lvls;
        this.monsters_power = m_.data.strongest;
        this.monstersProto = [monster];
        this.gold = monster.data.gold;
        this.players_power = pl.power;
        this.smivka = false;
        this.players = {
            first: {
                player: pl,
                gold: monster.data.gold,
                smivka: false
            }
        }
    }
    players: {
        first: PlayerFight,
        second?: PlayerFight
    }
    cards?: {
        players?: (TreasureCard | DoorsCard)[],
        monsters?: (TreasureCard | DoorsCard)[]
    }
    pas: Set<string>;
    monsters: DoorsCard[]
    monstersProto: DoorsCard[]
    gold: number;
    lvls: number;

    monsters_power: number;
    players_power: number;

    smivka: boolean;
}
export class GameField {
    fight?: Fight
    openCards?: (TreasureCard | DoorsCard)[] = []

    get getField() {
        const pl_power = this.fight?.players_power;
        let m_power = this.fight?.monsters_power;
        let m_lvls = this.fight?.lvls;

        // this.fight?.players.main.power + this.fight?.players?.secondary?.power ?? 0;
        // this.fight?.monsters.forEach(el => m_power += el.data.strongest ?? 0);
        // this.fight?.monsters.forEach(el => m_power += el.data.get_lvls ?? 0);
        return {
            is_fight: this.fight ? true : false,
            fight: this.fight ? {
                players: {
                    main: {
                        player: this.fight?.players?.first?.player.data,
                        gold: this.fight?.players?.first?.gold,
                        smivka: this.fight?.players?.first?.smivka
                    },
                    secondary: {
                        player: this.fight?.players?.second?.player?.data,
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