import { AbstractData, DoorsDefs, MonsterData, TreasureData, TreasureDefs } from "./interfaces";
import { MunchkinGame } from "./mucnhkinGame";
import { PlayerGame } from "./player";

// refreshGame plusLog allLog

class AbstractCard {
    constructor(data: AbstractData) { this.abstractData = data }
    abstractData: AbstractData;
    id: number;
}

// Bonus Ability Fight
export class TreasureCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        defs?: TreasureDefs,
        data?: TreasureData,
        strongest?: number,
        cost?: number,
        img?: string
    ) {
        super({ name, description, cardType: "Сокровище", cost, img });
        this.data = data;
        this.strong = strongest;
        this.defs = defs;
    }
    strong?: number;
    data: TreasureData;
    defs?: TreasureDefs;
    game?: MunchkinGame;
    can_use(pl?: PlayerGame) {
        if (!this.game || this.game.endgame) return
        const type = this.data.treasureType;
        const cur = this.game.current_player === pl;
        if (type == "Надеваемая") return !this.game.is_fight && cur;
        else if (type == "Боевая") return this.game.is_fight;
        else return true
    }
    getData(pl?: PlayerGame): ITreasure {
        return {
            abstractData: this.abstractData,
            strongest: this.strong,
            data: this.data,
            id: this.id,
            use: this.can_use(pl)
        }
    }
}
export interface ITreasure {
    abstractData: AbstractData;
    strongest: number;
    data: TreasureData;
    id: number;
    use: boolean;
}
export type DoorTypes = "Класс" | "Раса" | "Проклятие" | "Монстр" | "МонстрБаф"
export interface IMonsterBuff {
    strong: number
    gold: number
}
export class DoorCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        type: DoorTypes,
        optional: {
            monster?: MonsterData,
            defs?: DoorsDefs,
            is_super?: boolean,
            cost?: number,
            img?: string,
            monsterBuff?: IMonsterBuff
        }
    ) {
        super({ name, description, cardType: type, img: optional.img, cost: optional.cost });
        this.monster = optional.monster;
        this.defs = optional.defs;
        this.is_super = optional.is_super
    }
    monster?: MonsterData | undefined;
    defs: DoorsDefs | undefined;
    is_super: boolean | undefined;
    game?: MunchkinGame;
    monsterBuff?: IMonsterBuff // для бафа монстров
    can_use(pl?: PlayerGame) {
        if (!this.game || this.game.endgame) return
        const type = this.abstractData.cardType;
        const cur = this.game.current_player === pl;
        if (type == "Класс" || type == "Раса") return !this.game.is_fight && cur;
        else if (type == "Монстр") return this.game.step == 1 && cur;
        else return true
    }
    getData(pl?: PlayerGame): IDoor {
        return {
            abstractData: this.abstractData,
            data: this.monster,
            id: this.id,
            is_super: this.is_super,
            use: this.can_use(pl)
        }
    }
    clone = (d: DoorCard) => {
        return new DoorCard(
            this.abstractData.name,
            this.abstractData.description,
            this.abstractData.cardType as "Класс" | "Раса" | "Проклятие" | "Монстр",
            {
                monster: this.monster,
                defs: this.defs,
                is_super: this.is_super,
                cost: this.abstractData.cost,
                img: this.abstractData.img,
                monsterBuff: this.monsterBuff
            }
        )
    }
}
export interface IDoor {
    abstractData: AbstractData;
    data: MonsterData;
    id: number;
    is_super: boolean;
    use: boolean;
}
