import { DoorsCard } from "src/data/mucnhkin";

const type = "Монстр"
export const MONSTERS: DoorsCard[] = [
    new DoorsCard(
        "Огоршённая трава",
        "Победви траву, элфы тянут дополнительное сокровище",
        type,
        {
            lvl: 1,
            gold: 1,
            undead: false,
        },
        {}, // Если эльф + сокровище
        ""
    ),
    new DoorsCard(
        "3872 орка", // name
        "+6 против дварфов (старые счёты)", // description
        type,
        {
            lvl: 10,
            gold: 3,
            undead: false,
        },
        {}, // кубик, 2 и меньше смерть иначе потеря уровней сколько выпало
        "", // img
    ),
    new DoorsCard(
        "Костян", // name
        "Если пришлось смыватся - теряешь уровень", // description
        type,
        {
            lvl: 2,
            gold:1,
            undead: true,
        },
        {}, // -2 lvl
        "", // img
    ),
]