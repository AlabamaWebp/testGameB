import { TreasureCard } from "src/data/mucnhkin";
import { TreasureData } from "src/data/munchkin/interfaces";

function createShmot(
    name: string,
    desc: string,
    defs: TreasureData,
    strong: number
) {
    return new TreasureCard(
        name,
        desc,
        defs,
        strong
    )
}
const type = "Надеваемая"
export const EQUIPMENT: TreasureCard[] = [
    createShmot("Шипастые коленки", "",
        {
            treasureType: type,
            template: "Рядом",
            cost: 200,
        },
        1
    ),

    createShmot("Слизистая оболочка",
        "",
        {
            treasureType: type,
            template: "Броник",
            cost: 200,
        },
        1
    ),
    createShmot("Башмаки могучего пенделя", "",
        {
            treasureType: type,
            template: "Броник",
            cost: 400,
        },
        2
    ),
    createShmot("Огромный камень", "",
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
            treasureType: type,
            defs: {
                condition: (defs) => {
                    return defs.player.d_field_cards.rasses.some(el => el.abstractData.name == "Дварф")
                }
            }
        },
        3 /// HZ
    ),
    createShmot("Лучок с ленточками",
        "",
        {
            treasureType: type,
            template: "2 Руки"
        },
        4
    ),

]