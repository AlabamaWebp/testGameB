import { DoorCard } from "src/data/munchkin/cards";

function createClass(
    name: string,
    desc: string,
    // cost?: number,
    super1: boolean = false,
) {
    return new DoorCard(
        name,
        desc,
        "Раса",
        { is_super: super1 }
        // cost
    )
}
export const RASES: DoorCard[] = [
    createClass(
        "Эльф",
        "У тебя +1 на смывку, получай уровень за помощь в убийстве монстра",
    ),
    createClass(
        "Эльф",
        "У тебя +1 на смывку, получай уровень за помощь в убийстве монстра",
    ),
    createClass(
        "Дварф",
        "Может нести 6 карт и сколько угодно больших вещей",
    ), createClass(
        "Дварф",
        "Может нести 6 карт и сколько угодно больших вещей",
    ),
    createClass(
        "Полукровка",
        "Позволяет носить 2 расы, либо убирает недостатки единственной",
        true
    ),
    createClass(
        "Полукровка",
        "Позволяет носить 2 расы, либо убирает недостатки единственной",
        true
    ),

]