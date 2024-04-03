import { TreasureCard } from "src/data/munchkin/playerAndCards";
import { TreasureData, TreasureDefs } from "src/data/munchkin/interfaces";

function createUsed(
    name: string,
    desc: string,
    defs: TreasureDefs,
    data: TreasureData
) {
    return new TreasureCard(
        name,
        desc,
        defs,
        data
    )
}
const type = "Используемая"
export const USED: TreasureCard[] = [
    createUsed("Закорми мастера", "",
        {
            action: (defs) => { defs.player.changeLvl(1) },
            log_txt: 'повышая свой уровень на 1'
        },
        {
            treasureType: type,
        }
    ),
    createUsed("Примени непонятные правила", "",
        {
            action: (defs) => { defs.player.changeLvl(1) },
            log_txt: 'повышая свой уровень на 1'
        },
        {
            treasureType: type,
        }
    ),

]