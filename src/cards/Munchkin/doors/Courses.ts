import { DoorsCard, defsData } from "src/data/mucnhkin";
const type = "Раса"
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