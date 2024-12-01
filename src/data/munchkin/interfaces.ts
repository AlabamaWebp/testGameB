import { MunchkinGame } from "./mucnhkinGame";
import { DoorCard, DoorTypes, IDoor, ITreasure, TreasureCard } from "./cards";
import { MunckinPlayerStats, PlayerGame } from "./player";

export interface DoorsDefs {
    punishment?: (defs: defsData) => void, // видимо непотребство
    startActions?: (defs: defsData) => void, // 
    winActions?: (defs: defsData) => void,
    beforeSmivka?: (defs: defsData) => void,
    action?: (defs: defsData) => void, // в момент 
    effect?: (defs: defsData) => void, // дать приемущество класса или расы
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}
export interface MonsterData {
    get_lvls: number; // 
    strongest: number;
    gold: number;
    undead: boolean;
}

export interface TreasureData {
    treasureType: "Надеваемая" | "Используемая" | "Боевая"

    template?: "Шлем" | "Броник" | "Ноги" | "Рука"
    | "2 Руки" | "3 Руки" | "Рядом"

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
    cardType: DoorTypes | "Сокровище"
    img?: string;
    cost?: number
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
        this.arm,
        this.other]
        return findInMassAndDelete(id, f) as TreasureCard
    }
    get getAllCard() {
        const f = [this.helmet,
        this.body,
        this.legs,
        this.arm,
        this.other]
        return f.flat()
    }
}
export interface _fieldDoorCards {
    first?: DoorCard,
    second?: DoorCard,
    bonus?: DoorCard,
}
export interface IfieldDoorCards {
    first?: IDoor,
    second?: IDoor,
    bonus?: IDoor,
}
export class fieldDoorCards {
    rasses: _fieldDoorCards = {}
    classes: _fieldDoorCards = {}
    getClasses() {
        const tmp: IfieldDoorCards = {}
        if (this.classes.first) tmp.first = (this.classes.first?.getData())
        if (this.classes.second) tmp.second = (this.classes.second?.getData())
        if (this.classes.bonus) tmp.bonus = (this.classes.bonus?.getData())
        return tmp;
    }
    getRasses() {
        const tmp: IfieldDoorCards = {}
        if (this.rasses.first) tmp.first = (this.rasses.first?.getData())
        if (this.rasses.second) tmp.second = (this.rasses.second?.getData())
        if (this.rasses.bonus) tmp.bonus = (this.rasses.bonus?.getData())
        return tmp;
    }
    getRasesMass() {
        const tmp: IDoor[] = []
        if (this.rasses.first) tmp.push(this.rasses.first?.getData())
        if (this.rasses.second) tmp.push(this.rasses.second?.getData())
        if (this.rasses.bonus) tmp.push(this.rasses.bonus?.getData())
        return tmp;
    }
    getClassesMass() {
        const tmp: IDoor[] = []
        if (this.classes.first) tmp.push(this.classes.first?.getData())
        if (this.classes.second) tmp.push(this.classes.second?.getData())
        if (this.classes.bonus) tmp.push(this.classes.bonus?.getData())
        return tmp;
    }
    findAndDel(id: number): DoorCard | undefined {
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
function findInMassAndDelete(id: number, f: DoorCard[][] | TreasureCard[][]) {
    const tmp = f.find(el => el.find(e => e.id == id));
    if (!tmp) return
    const ret = tmp.find(e => e.id == id);
    //@ts-ignore
    tmp.splice(tmp.indexOf(ret), 1)
    return ret
}
export class defsData {
    constructor(player?: PlayerGame, game?: MunchkinGame) {
        this.player = player;
        this.game = game;
    }
    player?: PlayerGame
    game?: MunchkinGame
}
interface PlayerFight {
    player: PlayerGame
    gold: number
    smivka: boolean
}
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