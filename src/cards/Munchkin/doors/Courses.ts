import { CourseCard, PlayerGame, defsData } from "src/interfaces/mucnhkin";

export const COURSES: CourseCard[] = [
    new CourseCard(
        "Потеряй уровень",
        "Теряешь 1 уровень",
        (def: defsData) => {def.player.changeLvl(-1)}
    ),
    new CourseCard(
        "Потеряй уровень ДВАЖДЫ",
        "Теряешь 2 уровеня",
        (def: defsData) => {def.player.changeLvl(-2)}
    ),
]