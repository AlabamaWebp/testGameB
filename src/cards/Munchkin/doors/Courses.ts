import { DoorsCard } from "src/data/mucnhkin";
import { defsData } from "src/data/munchkin/interfaces";
const type = "Проклятие"
export const COURSES: DoorsCard[] = [
    new DoorsCard(
        "Потеряй уровень",
        "Теряешь 1 уровень",
        type,
        undefined,
        {
            action: (def: defsData) => {def.player.changeLvl(-1)}
        }
    ),
    new DoorsCard(
        "Потеряй уровень ДВАЖДЫ",
        "Теряешь 2 уровеня",
        type,
        undefined,
        {
            action: (def: defsData) => {def.player.changeLvl(-1)}
        }
    ),
]