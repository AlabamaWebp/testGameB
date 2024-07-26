import { TreasureDefs, TreasureData } from "src/data/munchkin/interfaces";
import { TreasureCard } from "src/data/munchkin/cards";

function createCombat(
    name: string,
    desc: string,
    strong?: number,
    defs?: TreasureDefs,
    cost?: number
) {
    return new TreasureCard(
        name,
        desc,
        defs,
        { treasureType: "Боевая" },
        strong,
        cost
    )
}
export const COMBAT: TreasureCard[] = [
    createCombat(
        "Спячечное зелье",
        "Играть в бой, +2 любой стороне.",
        2,
        undefined,
        200,
    ),
    createCombat(
        "Зелье говна",
        "Играть в бой, +4 любой стороне.",
        4,
        undefined,
        200,
    ),
]