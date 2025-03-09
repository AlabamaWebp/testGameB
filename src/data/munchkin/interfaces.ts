import { DoorCard, IDoor } from "./classes/DoorCard";
import { TreasureCard } from "./classes/TreasureCard";
import { MunchkinGame } from "./mucnhkinGame";
import { PlayerGame } from "./player";

export class fieldTreasureCards {
    helmet: TreasureCard[] = []
    body: TreasureCard[] = []
    legs: TreasureCard[] = []
    arm: TreasureCard[] = []
    other: TreasureCard[] = []
    count = {
        "helmet": 1,
        "body": 1,
        "legs": 1,
        "arm": 2,
    }
    findAndDel(id: number): TreasureCard | undefined {
        const f = [this.helmet,
        this.body,
        this.legs,
        this.arm,
        this.other]
        return findInMassAndDelete(id, f) as TreasureCard
    }
    get getAllCard() {
        const f = [this.helmet,
        this.body,
        this.legs,
        this.arm,
        this.other]
        return f.flat()
    }
}
export interface _fieldDoorCards {
    first?: DoorCard,
    second?: DoorCard,
    bonus?: DoorCard,
}
export interface IfieldDoorCards {
    first?: IDoor,
    second?: IDoor,
    bonus?: IDoor,
}
export class fieldDoorCards {
    rasses: _fieldDoorCards = {}
    classes: _fieldDoorCards = {}
    getClasses() {
        const tmp: IfieldDoorCards = {}
        if (this.classes.first) tmp.first = (this.classes.first?.getData())
        if (this.classes.second) tmp.second = (this.classes.second?.getData())
        if (this.classes.bonus) tmp.bonus = (this.classes.bonus?.getData())
        return tmp;
    }
    getRasses() {
        const tmp: IfieldDoorCards = {}
        if (this.rasses.first) tmp.first = (this.rasses.first?.getData())
        if (this.rasses.second) tmp.second = (this.rasses.second?.getData())
        if (this.rasses.bonus) tmp.bonus = (this.rasses.bonus?.getData())
        return tmp;
    }
    getRasesMass() {
        const tmp: IDoor[] = []
        if (this.rasses.first) tmp.push(this.rasses.first?.getData())
        if (this.rasses.second) tmp.push(this.rasses.second?.getData())
        if (this.rasses.bonus) tmp.push(this.rasses.bonus?.getData())
        return tmp;
    }
    getClassesMass() {
        const tmp: IDoor[] = []
        if (this.classes.first) tmp.push(this.classes.first?.getData())
        if (this.classes.second) tmp.push(this.classes.second?.getData())
        if (this.classes.bonus) tmp.push(this.classes.bonus?.getData())
        return tmp;
    }
    findAndDel(id: number): DoorCard | undefined {
        const t = ['first', 'second', 'bonus',]
        for (const i of t) {
            const r = this.rasses[i]
            const c = this.classes[i]
            if (r?.id == id) {
                const tmp = r
                delete this.rasses[i]
                return tmp
            }
            if (c?.id == id) {
                const tmp = c
                delete this.classes[i]
                return tmp
            }
        } /// это надо переписать
    }
}
function findInMassAndDelete(id: number, f: DoorCard[][] | TreasureCard[][]) {
    const tmp = f.find(el => el.find(e => e.id == id));
    if (!tmp) return
    const ret = tmp.find(e => e.id == id);
    //@ts-ignore
    tmp.splice(tmp.indexOf(ret), 1)
    return ret
}
export class defsData {
    constructor(player?: PlayerGame, game?: MunchkinGame) {
        this.player = player;
        this.game = game;
    }
    player?: PlayerGame
    game?: MunchkinGame
}