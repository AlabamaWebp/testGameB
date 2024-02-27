import { TreasureCard, TreasureData, TreasureDefs } from "src/interfaces/mucnhkin";

export const TREASURES: TreasureCard[] = [
    new TreasureCard(
        "Шипастые коленки",
        "",
        {
            template: "Рядом",
            cost: 200,
        },
        1
    ),
    new TreasureCard(
        "Слизистая оболочка",
        "",
        {
            template: "Броник",
            cost: 200,
        },
        1
    ),
    new TreasureCard(
        "Башмаки могучего пенделя",
        "",
        {
            template: "Броник",
            cost: 400,
        },
        2
    ),
    new TreasureCard(
        "Огромный камень",
        "",
        {
            template: "2 Руки",
            big: true
        },
        3
    ),
    new TreasureCard(
        "Закорми мастера",
        "",
        {
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        },
    ),
    new TreasureCard(
        "Примени непонятные правила",
        "",
        {
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        },
    ),
    new TreasureCard(
        "Коротышные латы",
        "Только для дварфов",
        {
            defs: {
                condition: (defs) => {
                    return defs.player.field_cards.rasses.some(el => el.abstractData.name == "Дварф")
                }
            }
        },
    ),
]