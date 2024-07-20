import { DoorCard } from "src/data/munchkin/cards";
import { defsData } from "src/data/munchkin/interfaces";
const type = "Проклятие"
export const COURSES: DoorCard[] = [
    new DoorCard(
        "Потеряй уровень",
        "Теряешь 1 уровень",
        type,
        undefined,
        {
            action: (def: defsData) => {def.player.changeLvl(-1)}
        }
    ),
    new DoorCard(
        "Потеряй уровень ДВАЖДЫ",
        "Теряешь 2 уровеня",
        type,
        undefined,
        {
            action: (def: defsData) => {def.player.changeLvl(-1)}
        }
    ),
]