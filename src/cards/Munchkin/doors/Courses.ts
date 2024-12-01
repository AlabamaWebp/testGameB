import { DoorCard } from "src/data/munchkin/cards";
import { defsData, DoorsDefs } from "src/data/munchkin/interfaces";
const COURSES: DoorCard[] = [];
const type = "Проклятие"
function createCourse(
    name: string,
    desc: string,
    defs: DoorsDefs,
    count: number = 1
) {
    for (let i = 0; i < count; i++) {
        COURSES.push(new DoorCard(
            name,
            desc,
            type,
            { defs: defs }
        ))
    }
}
createCourse(
    "Потеряй уровень",
    "Теряешь 1 уровень",
    {
        action: (def: defsData) => { def.player.changeLvl(-1) }
    }
)
createCourse(
    "Потеряй уровень ДВАЖДЫ",
    "Теряешь 2 уровеня",
    {
        action: (def: defsData) => { def.player.changeLvl(-2) }
    }
)
export { COURSES };