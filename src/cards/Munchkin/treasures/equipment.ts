import { TreasureCard } from "src/data/munchkin/cards";
import { TreasureData, TreasureDefs } from "src/data/munchkin/interfaces";
import { Game } from "src/data/munchkin/mucnhkinGame";

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
            template: "Ноги",
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
                const tmp = defs.player.d_field_cards.getRasesMass().some(el => el.abstractData.name == "Дварф")
                if (!tmp) defs.player.player.socket.emit('condition', "Вы не дварф!")
                return tmp
            }
        },
        {
            treasureType: type,
            template: 'Броник',
            cost: 400
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