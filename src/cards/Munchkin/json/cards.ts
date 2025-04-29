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
            const card = JSON.parse(fs.readFileSync(path + name).toString()) as Card;
            if (card.abstractData.cardType == "Сокровище")
                tmp.Golds.push(card as TreasureCard);
            else
                tmp.Doors.push(card as DoorCard);
        })
    // console.log(tmp.map(e => e.abstractData.name));
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
            let f = fs.readdirSync(path);
            const a = JSON.parse(fs.readFileSync(path + name).toString());
            // console.log(a);
            const n = a.abstractData.name;
            if (!cond.includes(n))
                tmp[n.abstractData.name] = { images: "" }
        })
    console.log(Object.keys(tmp).length ? tmp : "Новых карт не обнаружено");
}
newcards();
