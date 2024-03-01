import { TreasureCard, TreasureData, TreasureDefs } from "src/interfaces/mucnhkin";

const type = "Надеваемая"
export const EQUIPMENT: TreasureCard[] = [
    new TreasureCard(
        "Шипастые коленки",
        "",
        {
            treasureType: type,
            template: "Рядом",
            cost: 200,
        },
        1
    ),
    new TreasureCard(
        "Слизистая оболочка",
        "",
        {
            treasureType: type,
            template: "Броник",
            cost: 200,
        },
        1
    ),
    new TreasureCard(
        "Башмаки могучего пенделя",
        "",
        {
            treasureType: type,
            template: "Броник",
            cost: 400,
        },
        2
    ),
    new TreasureCard(
        "Огромный камень",
        "",
        {
            treasureType: type,
            template: "2 Руки",
            big: true
        },
        3
    ),
    new TreasureCard(
        "Коротышные латы",
        "Только для дварфов",
        {
            treasureType: type,
            defs: {
                condition: (defs) => {
                    return defs.player.d_field_cards.rasses.some(el => el.abstractData.name == "Дварф")
                }
            }
        },
    ),
    new TreasureCard(
        "Лучок с ленточками",
        "",
        {
            treasureType: type,
            template: "2 Руки"
        },
        4
    ),
]