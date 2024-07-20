import { AbstractData, DoorsDefs, MonsterData, TreasureData, TreasureDefs } from "./interfaces";
import { MunchkinGame } from "./mucnhkinGame";

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
    use() {
        if (!this.game || this.game.endgame) return
        const type = this.data.treasureType;
        if (type == "Надеваемая") return !this.game.is_fight;
        else if (type == "Боевая") return this.game.is_fight;
        else return true
    }
    getData(): ITreasure {
        return {
            abstractData: this.abstractData,
            strongest: this.strong,
            data: this.data,
            id: this.id,
            use: this.use()
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
export class DoorCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        type: "Класс" | "Раса" | "Проклятие" | "Монстр",
        monster?: {
            strongest: number, // Сила (включая усиления и уровень)
            lvl: number, // Получаемый уровень
            gold: number,
            undead?: boolean,
        },
        defs?: DoorsDefs,
        is_super?: boolean,
        cost?: number,
        img?: string
    ) {
        super({ name, description, cardType: type, img, cost });
        monster ? this.data = {
            get_lvls: monster.lvl,
            strongest: monster.strongest,
            gold: monster.gold,
            undead: monster.undead ? true : false
        } : 0;
        this.defs = defs;
        this.is_super = is_super
    }
    data?: MonsterData;
    defs: DoorsDefs;
    is_super: boolean;
    game?: MunchkinGame
    get use() {
        if (!this.game || this.game.endgame) return
        const type = this.abstractData.cardType;
        if (type == ("Класс" || "Раса")) return !this.game.is_fight;
        else if (type == "Монстр") return this.game.step == 1;
        else return true
    }
    getData = (): IDoor => {
        return {
            abstractData: this.abstractData,
            data: this.data,
            id: this.id,
            is_super: this.is_super,
            use: this.use
        }
    }
    clone = (d: DoorCard) => {
        return new DoorCard(
            this.abstractData.name,
            this.abstractData.description,
            this.abstractData.cardType as "Класс" | "Раса" | "Проклятие" | "Монстр",
            {
                strongest: this.data.strongest,
                lvl: this.data.get_lvls,
                gold: this.data.gold,
                undead: this.data.undead,
            },
            this.defs,
            this.is_super,
            this.abstractData.cost,
            this.abstractData.img,
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
