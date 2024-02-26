import { CourseCard, PlayerGame } from "src/interfaces/mucnhkin";

export const COURSES: CourseCard[] = [
    new CourseCard(
        "Потеряй уровень",
        "Теряешь 1 уровень",
        (player: PlayerGame) => {player.changeLvl(-1)}
    ),
    new CourseCard(
        "Потеряй уровень ДВАЖДЫ",
        "Теряешь 2 уровеня",
        (player: PlayerGame) => {player.changeLvl(-2)}
    ),
]