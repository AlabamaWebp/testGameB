import { MonsterCard } from "src/interfaces/mucnhkin";

export const MONSTERS: MonsterCard[] = [
    new MonsterCard(
        "Огоршённая трава",
        "Победви траву, элфы тянут дополнительное сокровище",
        1,
        1,
        false,
        undefined,
        undefined, // Если эльф + сокровище
        undefined,
        undefined,
        ""
    ),
    new MonsterCard(
        "3872 орка", // name
        "+6 против дварфов (старые счёты)", // description
        10,  // lvl
        3,  // gold
        false, // undead
        undefined, // punishment 
        // кубик, 2 и меньше смерть иначе потеря уровней сколько выпало
        undefined, // startActions
        undefined, // winActions
        undefined, // beforeSmivka
        "", // img
    ),
    new MonsterCard(
        "Костян", // name
        "Если пришлось смыватся - теряешь уровень", // description
        2,  // lvl
        1,  // gold
        true, // undead
        undefined, // punishment 
        // -2 lvl
        undefined, // startActions
        undefined, // winActions
        undefined, // beforeSmivka
        "", // img
    ),
]