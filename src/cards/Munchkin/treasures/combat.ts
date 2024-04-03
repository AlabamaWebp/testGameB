import { TreasureDefs, TreasureData } from "src/data/munchkin/interfaces";
import { TreasureCard } from "src/data/munchkin/playerAndCards";

function createCombat(
    name: string,
    desc: string,
    defs?: TreasureDefs,
) {
    return new TreasureCard(
        name,
        desc,
        defs,
    )
}
const type = "Боевая"
export const COMBAT: TreasureCard[] = [
    createCombat("Спячечное зелье", "Играть в бой, +2 любой стороне.",
    ),
]