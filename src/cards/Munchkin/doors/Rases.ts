import { DoorCard } from "src/data/munchkin/classes/DoorCard"

const RASES: DoorCard[] = []
function createClass(
    name: string,
    desc: string,
    // cost?: number,
    super1: boolean = false,
    count = 1
) {
    for (let i = 0; i < count; i++) {
        RASES.push(new DoorCard(
            name,
            desc,
            "Раса",
            { is_super: super1 }
            // cost
        ))
    }
    return new DoorCard(
        name,
        desc,
        "Раса",
        { is_super: super1 }
    )
}
createClass(
    "Эльф",
    "У тебя +1 на смывку, получай уровень за помощь в убийстве монстра",
    false,
    2
)
createClass(
    "Дварф",
    "Может нести 6 карт и сколько угодно больших вещей",
    false,
    2
)
createClass(
    "Полукровка",
    "Позволяет носить 2 расы, либо убирает недостатки единственной",
    true,
    2
)

export { RASES };