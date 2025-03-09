import { DoorTypes } from "./DoorCard";

export class AbstractCard {
    constructor(data: AbstractData) { this.abstractData = data }
    abstractData: AbstractData;
    id: number;
}
export interface AbstractData {
    name: string;
    description: string;
    cardType: DoorTypes | "Сокровище"
    img?: string;
    cost?: number
}
