import { MunchkinGame } from "../mucnhkinGame";
import { PlayerGame } from "../player";
import { AbstractCard } from "./AbstractCard";
import { action_func } from "./Common";
import { IDoor } from "./Game";

export interface DoorsDefs {
    punishment?: action_func, // видимо непотребство
    startActions?: action_func, // 
    winActions?: action_func,
    beforeSmivka?: action_func,
    action?: action_func,
    // https://metanit.com/web/javascript/4.8.php .call() для функции
}
export interface MonsterData {
    get_lvls: number; // 
    strongest: number;
    gold: number;
    undead: boolean;
}
// Bonus Ability Fight
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
