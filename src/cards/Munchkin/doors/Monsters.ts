import { MonsterCard } from "src/interfaces/mucnhkin";

export const MONSTERS: MonsterCard[] = [
    new MonsterCard(
        "Огоршённая трава",
        "Победви траву, элфы тянут дополнительное сокровище",
        1,
        1,
        false,
        {}, // Если эльф + сокровище
        ""
    ),
    new MonsterCard(
        "3872 орка", // name
        "+6 против дварфов (старые счёты)", // description
        10,  // lvl
        3,  // gold
        false, // undead
        {}, // кубик, 2 и меньше смерть иначе потеря уровней сколько выпало
        "", // img
    ),
    new MonsterCard(
        "Костян", // name
        "Если пришлось смыватся - теряешь уровень", // description
        2,  // lvl
        1,  // gold
        true, // undead
        {}, // -2 lvl
        "", // img
    ),
]