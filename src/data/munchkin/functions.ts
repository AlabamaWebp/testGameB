import { fieldDoorCards, fieldTreasureCards } from "./interfaces";


export const shuffle = (array) => {
    let m = array.length, t, i;
    // Пока есть элементы для перемешивания
    while (m) {
        // Взять оставшийся элемент
        i = Math.floor(Math.random() * m--);
        // И поменять его местами с текущим элементом
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
// function shuffle(array: any) {
//     return array.sort(() => Math.random() - 0.5);
// }
export function p_getFieldCards(cards: fieldDoorCards | fieldTreasureCards) {
    const fields = Object.keys(cards);
    return fields
        .map(e => cards[e])
        .flat()
        .map(el => el.getData());
}
export function fillId() {
    let id = 0;
    this.cards.doors.forEach(el => {
        el.id = id;
        id++;
    })
    this.cards.treasures.forEach(el => {
        el.id = id;
        id++;
    })
}