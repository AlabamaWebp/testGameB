import { TreasureCard, TreasureData, TreasureDefs } from "src/interfaces/mucnhkin";

const type = "Используемая"
export const USED: TreasureCard[] = [
    new TreasureCard(
        "Закорми мастера",
        "",
        {
            treasureType: type,
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        },
    ),
    new TreasureCard(
        "Примени непонятные правила",
        "",
        {
            treasureType: type,
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        },
    ),
]