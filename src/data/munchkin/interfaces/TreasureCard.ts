import { MunchkinGame } from "../mucnhkinGame";
import { PlayerGame } from "../player";
import { AbstractCard, AbstractData } from "./AbstractCard";
import { defsData } from "./Common";

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
export interface TreasureDefs {
    condition?: (defs: defsData) => boolean
    action?: (defs: defsData) => void
    log_txt?: string
}
export interface TreasureData {
    treasureType: "Надеваемая" | "Используемая" | "Боевая"

    template?: "Шлем" | "Броник" | "Ноги" | "Рука"
    | "2 Руки" | "3 Руки" | "Рядом"

    big?: boolean
}