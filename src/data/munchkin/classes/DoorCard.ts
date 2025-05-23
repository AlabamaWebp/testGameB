import { defsData } from "../interfaces";
import { MunchkinGame } from "../mucnhkinGame";
import { PlayerGame } from "../player";
import { AbstractCard, AbstractData } from "./AbstractCard";

export class DoorCard extends AbstractCard {
    constructor(
        name: string,
        description: string,
        type: DoorTypes,
        optional: optionalDoors
    ) {
        super({ name, description, cardType: type, img: optional.img, cost: optional.cost });
        this.monster = optional.monster;
        this.defs = optional.defs;
        this.is_super = optional.is_super
    }
    monster?: MonsterData | undefined;
    defs?: DoorsDefs;
    is_super?: boolean;
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
    clone = () => {
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

export interface optionalDoors {
    monster?: MonsterData,
    defs?: DoorsDefs,
    is_super?: boolean,
    cost?: number,
    img?: string,
    monsterBuff?: IMonsterBuff
}
export interface IMonsterBuff {
    strong: number
    gold: number
}
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
export type DoorTypes = "Класс" | "Раса" | "Проклятие" | "Монстр" | "МонстрБаф"
