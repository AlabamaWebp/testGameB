import { MonsterData } from 'src/data/munchkin/interfaces';
import { DoorCard } from "src/data/munchkin/cards";

function createMonster(
    name: string,
    desc: string,
    monsterData: MonsterData,
    count: number = 1
) {
    for (let i = 0; i < count; i++) {
        MONSTERS.push(new DoorCard(
            name,
            desc,
            type,
            { monster: monsterData }
        ))
    }
}
const type = "Монстр";
export const MONSTERS: DoorCard[] = []
createMonster(
    "Огоршённая трава",
    "Победви траву, элфы тянут дополнительное сокровище",
    {
        strongest: 1,
        get_lvls: 1,
        gold: 1,
        undead: false,
    },
)
createMonster(
    "3872 орка", // name
    "+6 против дварфов (старые счёты)", // description
    {
        strongest: 10,
        get_lvls: 2,
        gold: 3,
        undead: false,
    },
)
createMonster(
    "Костян", // name
    "Если пришлось смыватся - теряешь уровень", // description
    {
        strongest: 2,
        get_lvls: 1,
        gold: 1,
        undead: true,
    },
)
export default MONSTERS;