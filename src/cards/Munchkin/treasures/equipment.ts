import { TreasureCard } from "src/data/munchkin/cards";
import { TreasureData, TreasureDefs } from "src/data/munchkin/interfaces";
import { Game } from "src/data/munchkin/mucnhkinGame";

function createShmot(
    name: string,
    desc: string,
    defs: TreasureDefs,
    data: TreasureData,
    strong: number,
    cost?: number
) {
    return new TreasureCard(
        name,
        desc,
        defs,
        data,
        strong,
        cost
    )
}
const type = "Надеваемая"
export const EQUIPMENT: TreasureCard[] = [
    createShmot("Шипастые коленки", "",
        undefined,
        {
            treasureType: type,
            template: "Рядом",
        },
        1,
        200,
    ),

    createShmot("Слизистая оболочка",
        "",
        undefined,
        {
            treasureType: type,
            template: "Броник",
        },
        1,
        200,
    ),
    createShmot("Башмаки могучего пенделя", "",
        undefined,
        {
            treasureType: type,
            template: "Ноги",
        },
        2,
        400
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
                const tmp = defs.player.field_cards.doors.getRasesMass().some(el => el.abstractData.name == "Дварф")
                if (!tmp) defs.player.player.socket.emit('condition', "Вы не дварф!")
                return tmp
            }
        },
        {
            treasureType: type,
            template: 'Броник',
        },
        3, /// HZ
        400
    ),
    createShmot("Лучок с ленточками",
        "",
        undefined,
        {
            treasureType: type,
            template: "2 Руки"
        },
        4,
        800
    ),

]