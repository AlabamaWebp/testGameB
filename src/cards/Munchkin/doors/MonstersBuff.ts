import { DoorCard, IMonsterBuff } from "src/data/munchkin/classes/DoorCard"

export const MONSTERS: DoorCard[] = []
function createBuff(name: string, mb: IMonsterBuff | number = 1, count: number = 1, desc: string = "") {
    if (typeof mb === "number") {
        mb = {
            strong: mb * 5,
            gold: mb
        }
        desc = `${mb.strong} к силе монстра, ${mb.gold} к сокровищам`
    }
    for (let i = 0; i < count; i++) {
        MONSTERS.push(new DoorCard(
            name,
            desc,
            type,
            { monsterBuff: mb }
        ))
    }
}
const type = "МонстрБаф"
createBuff(
    "Умудрённый",
    2
)
createBuff(
    "Эээ чуть лучше чем вчера",
    1
)
createBuff(
    "Утуплённый",
    -1
)
createBuff(
    "Младенец",
    -2
)
export default MONSTERS;