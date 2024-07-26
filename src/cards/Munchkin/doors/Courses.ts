import { DoorCard } from "src/data/munchkin/cards";
import { defsData, DoorsDefs } from "src/data/munchkin/interfaces";
const type = "Проклятие"
function createCourse(
    name: string, desc: string,
    defs: DoorsDefs
) {
    return new DoorCard(
        name,
        desc,
        type,
        { defs: defs }
    )
}
export const COURSES: DoorCard[] = [
    createCourse(
        "Потеряй уровень",
        "Теряешь 1 уровень",
        {
            action: (def: defsData) => { def.player.changeLvl(-1) }
        }
    ),
    createCourse(
        "Потеряй уровень ДВАЖДЫ",
        "Теряешь 2 уровеня",
        {
            action: (def: defsData) => { def.player.changeLvl(-1) }
        }
    ),
]