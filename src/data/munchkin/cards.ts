import { PlayerGlobal } from "../main";
import { AbstractData, DoorsDefs, MonsterData, TreasureData, TreasureDefs, fieldDoorCards, fieldTreasureCards } from "./interfaces";
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
    defs?: TreasureDefs
    getData() {
        return {
            abstractData: this.abstractData,
            strongest: this.strong,
            data: this.data,
            id: this.id
            // name: this.abstractData.name,
            // desciption: this.abstractData.description,
            // cardType: this.abstractData.cardType,
            // strongest: this.strong,
            // treasureType: this.data.treasureType,
            // template: this.data.template,
            // cost: this.data.cost,
            // big: this.data.big,
            // img: this.abstractData.img
        }
    }
}

export class DoorsCard extends AbstractCard {
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
    is_super: boolean
    getData = () => {
        return {
            abstractData: this.abstractData,
            data: this.data,
            id: this.id,
            is_super: this.is_super
            // name: this.abstractData.name,
            // desciption: this.abstractData.description,
            // cardType: this.abstractData.cardType,
            // strongest: this.strong,
            // treasureType: this.data.treasureType,
            // template: this.data.template,
            // cost: this.data.cost,
            // big: this.data.big,
            // img: this.abstractData.img
        }
    }
    clone = (d: DoorsCard) => {
        return new DoorsCard(
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
