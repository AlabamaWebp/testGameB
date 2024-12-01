import { DoorCard, optionalDoors } from "src/data/munchkin/cards"


const CLASSES: DoorCard[] = [];

function createClass(
    name: string,
    desc: string,
    optional?: optionalDoors,
    count = 1
) {
    for (let i = 0; i < count; i++) {
        CLASSES.push(new DoorCard(
            name,
            desc,
            "Класс",
            optional
        ))
    }
}
createClass(
    "Воин",
    "Сбрось карту чтобы получить 1 бонус к силе в бою (до 3), Даёт 1 силу перманентно",
    {}, 2
)
createClass(
    "Волшебник",
    "Полёт: Можешь сбросить до 3 карт после смывки, каждая тебе прибавит + 1 на смывку, Усмирение: Сбрось всю руку (не меньше 3 карт) чтобы усмирить монстра (он отдаёт сокровища, но не уровень)",
    {}, 2
)
createClass(
    "Суперманчкин",
    "Позволяет носить 2 класса, либо убирает недостатки единственного",
    { is_super: true }, 2
)

export { CLASSES };