import { DoorCard, IMonsterBuff } from "src/data/munchkin/cards";

function createBuff(name: string, desc: string, mb: IMonsterBuff) {
    return new DoorCard(
        name,
        desc,
        type,
        {
            monsterBuff: mb
        }
    )
}
const type = "МонстрБаф"
export const MONSTERS: DoorCard[] = [
    createBuff(
        "Умудрённый",
        "+10 к силе монстра, +2 к сокровищам",
        {
            strong: 10,
            gold: 2
        }
    ),
    createBuff(
        "Эээ чуть лучше чем вчера",
        "+5 к силе монстра, +1 к сокровищам",
        {
            strong: 5,
            gold: 1
        }
    ),
    createBuff(
        "Утуплённый",
        "-10 к силе монстра, -2 к сокровищам",
        {
            strong: -10,
            gold: -2
        }
    ),
    createBuff(
        "Младенец",
        "-5 к силе монстра, -1 к сокровищам",
        {
            strong: -10,
            gold: -2
        }
    ),
    
]