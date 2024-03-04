import { TreasureCard } from "src/data/mucnhkin";
import { TreasureData } from "src/data/munchkin/interfaces";

function createUsed(
    name: string,
    desc: string,
    defs: TreasureData
) {
    return new TreasureCard(
        name,
        desc,
        defs
    )
}
const type = "Используемая"
export const USED: TreasureCard[] = [
    createUsed("Закорми мастера", "",
        {
            treasureType: type,
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        }
    ),
    createUsed("Примени непонятные правила", "",
        {
            treasureType: type,
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        }
    ),

]