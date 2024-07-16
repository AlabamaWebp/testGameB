import { TreasureDefs, TreasureData } from "src/data/munchkin/interfaces";
import { TreasureCard } from "src/data/munchkin/cards";

function createCombat(
    name: string,
    desc: string,
    defs?: TreasureDefs,
    cost?: number
) {
    return new TreasureCard(
        name,
        desc,
        defs,
        {treasureType: "Боевая"},
        undefined,
        cost
    )
}
export const COMBAT: TreasureCard[] = [
    createCombat("Спячечное зелье", "Играть в бой, +2 любой стороне.",
        {},
        200),
]