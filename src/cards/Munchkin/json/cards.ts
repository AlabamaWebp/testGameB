import * as fs from "fs"
import { Card } from "src/data/munchkin/interfaces"
import { DoorCard, DoorsDefs } from "src/data/munchkin/interfaces/DoorCard"
import { TreasureCard, TreasureDefs } from "src/data/munchkin/interfaces/TreasureCard"


interface card {
    images: string | string[]
    door_funcs?: DoorsDefs
    gold_funcs?: TreasureDefs
}
// Для определения количества экземпляров / путей к картинкам
const imges: { [i: string]: card } = {
    'Подоходный налог': { images: "" },
    'Потеряй две карты': { images: "" },
    'Потеряй мелкую шмотку': { images: "" },
    'Потеряй надетый головняк!': { images: "" },
    'Потеряй уровень!': { images: "" },
    'Воин': { images: "" },
    'Молотая крысотка': { images: "" },
    'Плутонниевый дракон': { images: "" },
    'Ошибка сложения': { images: '' }
}

type to_return = { Doors: DoorCard[], Golds: TreasureCard[] }
function getCardsFromFolder(): to_return {
    const tmp: to_return = {
        Doors: [],
        Golds: []
    }
    const path = fs.existsSync("./tsconfig.json") ? "./src/cards/Munchkin/json/" : "./";
    let f = fs.readdirSync(path);
    f.filter(e => e.includes(".json"))
        .forEach(name => {
            let card = JSON.parse(fs.readFileSync(path + name).toString()) as any;
            if (card.abstractData.cardType == "Сокровище") {
                card = new TreasureCard(
                    card.abstractData.name,
                    card.abstractData.description,
                    undefined,
                    card.data,
                    card.strongest,
                    card.abstractData.cost,
                )
                tmp.Golds.push(card as TreasureCard);
            }
            else {
                card = new DoorCard(
                    card.abstractData.name,
                    card.abstractData.description,
                    card.abstractData.cardType as "Класс" | "Раса" | "Проклятие" | "Монстр",
                    {
                        monster: card.monster,
                        // defs: this.defs,
                        is_super: card.is_super,
                        cost: card.abstractData.cost,
                        // img: this.abstractData.img,
                        // monsterBuff: card.monsterBuff
                    })
                tmp.Doors.push(card);
            }
        })
    return tmp;
}
 
export const CARDS = getCardsFromFolder();

function newcards() {
    const tmp = {}
    const path = fs.existsSync("./tsconfig.json") ? "./src/cards/Munchkin/json/" : "./";
    let f = fs.readdirSync(path);
    const cond = Object.keys(imges)
    f.filter(e => e.includes(".json"))
        .forEach(name => {
            const a = JSON.parse(fs.readFileSync(path + name).toString());
            const n = a.abstractData.name;
            if (!cond.includes(n))
                tmp[a.abstractData.name] = { images: "" }
        })
    console.log(Object.keys(tmp).length ? tmp : "Новых карт не обнаружено");
}
newcards();
