import { TreasureCard, TreasureData, TreasureDefs } from "src/interfaces/mucnhkin";

export const TREASURES: TreasureCard[] = [
    new TreasureCard(
        "Шипастые коленки",
        "",
        {
            treasureType: "Надеваемая",
            template: "Рядом",
            cost: 200,
        },
        1
    ),
    new TreasureCard(
        "Слизистая оболочка",
        "",
        {
            treasureType: "Надеваемая",
            template: "Броник",
            cost: 200,
        },
        1
    ),
    new TreasureCard(
        "Башмаки могучего пенделя",
        "",
        {
            treasureType: "Надеваемая",
            template: "Броник",
            cost: 400,
        },
        2
    ),
    new TreasureCard(
        "Огромный камень",
        "",
        {
            treasureType: "Надеваемая",
            template: "2 Руки",
            big: true
        },
        3
    ),
    new TreasureCard(
        "Закорми мастера",
        "",
        {
            treasureType: "Используемая",
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        },
    ),
    new TreasureCard(
        "Примени непонятные правила",
        "",
        {
            treasureType: "Используемая",
            defs: {
                action: (defs) => { defs.player.changeLvl(1) }
            }
        },
    ),
    new TreasureCard(
        "Коротышные латы",
        "Только для дварфов",
        {
            treasureType: "Надеваемая",
            defs: {
                condition: (defs) => {
                    return defs.player.field_cards.rasses.some(el => el.abstractData.name == "Дварф")
                }
            }
        },
    ),
    new TreasureCard(
        "Лучок с ленточками",
        "",
        {
            treasureType: "Надеваемая",
            template: "2 Руки"
        },
        4
    ),
]