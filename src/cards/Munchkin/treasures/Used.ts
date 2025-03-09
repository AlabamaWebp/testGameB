import { TreasureDefs, TreasureCard } from "src/data/munchkin/classes/TreasureCard"

function createUsed(
    name: string,
    desc: string,
    defs: TreasureDefs,
    // data: TreasureData | {[index: number]: string | boolean},
    cost?: number
) {
    return new TreasureCard(
        name,
        desc,
        defs,
        {treasureType: 'Используемая'},
        cost
    )
}
export const USED: TreasureCard[] = [
    createUsed("Закорми мастера", "",
        {
            action: (defs) => { defs.player.changeLvl(1) },
            log_txt: 'Повысит твой уровень на 1'
        },

    ),
    createUsed("Примени непонятные правила", "",
        {
            action: (defs) => { defs.player.changeLvl(1) },
            log_txt: 'Повысит твой уровень на 1'
        },
    ),

]