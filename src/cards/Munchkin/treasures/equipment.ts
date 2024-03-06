import { TreasureCard } from "src/data/mucnhkin";
import { TreasureData, TreasureDefs } from "src/data/munchkin/interfaces";

function createShmot(
    name: string,
    desc: string,
    defs: TreasureDefs,
    data: TreasureData,
    strong: number
) {
    return new TreasureCard(
        name,
        desc,
        defs,
        data,
        strong
    )
}
const type = "Надеваемая"
export const EQUIPMENT: TreasureCard[] = [
    createShmot("Шипастые коленки", "",
        undefined,
        {
            treasureType: type,
            template: "Рядом",
            cost: 200,
        },
        1
    ),

    createShmot("Слизистая оболочка",
        "",
        undefined,
        {
            treasureType: type,
            template: "Броник",
            cost: 200,
        },
        1
    ),
    createShmot("Башмаки могучего пенделя", "",
        undefined,
        {
            treasureType: type,
            template: "Броник",
            cost: 400,
        },
        2
    ),
    createShmot("Огромный камень", "",
        undefined,
        {
            treasureType: type,
            template: "2 Руки",
            big: true
        },
        3
    ),
    createShmot("Коротышные латы",
        "Только для дварфов",
        {
            condition: (defs) => {
                return defs.player.d_field_cards.rasses.some(el => el.abstractData.name == "Дварф")
            }
        },
        {
            treasureType: type,
        },
        3 /// HZ
    ),
    createShmot("Лучок с ленточками",
        "",
        undefined,
        {
            treasureType: type,
            template: "2 Руки"
        },
        4
    ),

]