import { PlayerGlobal } from "../main";
import { TreasureCard, DoorCard, ITreasure, IDoor } from "./cards";
import { fieldTreasureCards, fieldDoorCards, defsData, _fieldDoorCards, IfieldDoorCards, Fight } from "./interfaces";
import { MunchkinGame } from "./mucnhkinGame";

export interface MunckinPlayerStats {
    name: string;
    lvl: number;
    sex: "Мужчина" | "Женщина";
    t_field: {
        helmet: ITreasure[];
        body: ITreasure[];
        legs: ITreasure[];
        arm: ITreasure[];
        other: ITreasure[];
    };
    d_field: {
        rasses: IfieldDoorCards,
        classes: IfieldDoorCards,
    },
    cards?: (ITreasure | IDoor)[]
    queue: number,
    max_cards: number,
    power: number,
    coins: number;
}
export class PlayerGame {
    constructor(player: PlayerGlobal, sex: "Мужчина" | "Женщина", queue: number) {
        this.player = player;
        this.sex = sex;
        this.alive = true;
        this.queue = queue; // Очередь игрока
    }
    readonly queue: number;

    private lvl: number = 1;
    field_cards = {
        doors: new fieldDoorCards(),
        treasures: new fieldTreasureCards()
    }
    cards: (TreasureCard | DoorCard)[] = [];
    private max_cards: number = 5;
    alive: boolean;
    smivka_power: number = 4; // x > 4
    cubik = 0;
    coins: number = 0;

    readonly player: PlayerGlobal;
    readonly sex: "Мужчина" | "Женщина";

    get power() {
        let tmp = this.lvl;
        // const cards = Object.keys(this.field_cards.treasures);
        // cards.forEach((el: string) => {
        //     if (this.field_cards.treasures[el] && el != 'count') {
        //         this.field_cards.treasures[el].forEach(card1 => {
        //             tmp += card1.strong
        //         });
        //     }
        // })
        this.field_cards.treasures.getAllCard.forEach(el => tmp += el.strong ?? 0)
        return tmp;
    }
    
    stats(show_cards = false) {
        const tmp: MunckinPlayerStats = {
            name: this.player.name,
            lvl: this.lvl,
            sex: this.sex,
            t_field: {
                helmet: this.field_cards.treasures?.helmet?.map(el => el.getData()),
                body: this.field_cards.treasures?.body?.map(el => el.getData()),
                legs: this.field_cards.treasures?.legs?.map(el => el.getData()),
                arm: this.field_cards.treasures?.arm?.map(el => el.getData()),
                other: this.field_cards.treasures?.other?.map(el => el.getData()),
            }, d_field: {
                rasses: this.field_cards.doors?.getRasses(),
                classes: this.field_cards.doors?.getClasses(),
            },
            queue: this.queue,
            max_cards: this.max_cards,
            power: this.power,
            coins: this.coins
        }
        if (show_cards) tmp.cards = this.cards.map(el => el?.getData(this)).reverse()
        return tmp
    }

    changeLvl(count: number, canWin = false) {
        this.lvl += count;
        if (this.lvl < 1)
            this.lvl = 1;
        if (this.lvl > 9) {
            if (canWin) {
                // победа
                setTimeout(() => this.game.Player.logging("Победа игрока " + this.player.name), 100);
                this.game.endgame = true;
            }
            else {
                this.game.Player.logging(this.player.name + " попытался повысить уровень до 10, но увы неудачно")
                this.lvl = 9;
            }
        }
        // const game = this.player.position as Game;
        // game.playersGameRefresh();
    }

    private cardById(id: number): TreasureCard | DoorCard { return this.cards.find(el => el.id == id) }
    private delCard(card: TreasureCard | DoorCard) { this.cards = this.cards.filter(el => el != card) }
    private get game(): MunchkinGame | undefined { return this.player.position instanceof MunchkinGame ? this.player.position : undefined }
    get defsForCard() { return new defsData(this, this.game) }

    useCard(id: number) {
        const card = this.cardById(id);
        const game = this.game;
        if (!card || !game || !card.can_use(this)) {
            this.player.socket.emit('error', 'Ошибка использования карты')
            return
        };
        const help = {
            "Шлем": 'helmet',
            "Броник": 'body',
            "Ноги": 'legs',
            "Рука": 'arm',
            "2 Руки": 'arm',
            "3 Руки": 'arm',
            "Рядом": "other",
            'Класс': 'classes',
            'Раса': 'rasses'
        }
        //  "Рядом" 
        // other

        if (card instanceof TreasureCard) {
            const defs = this.defsForCard
            if (card.defs?.condition && !card.defs?.condition(defs))
                return // Если не выполнено условие то габелла
            ////////////// 
            if (card.data.treasureType == 'Надеваемая') {
                if (game.is_fight) return
                const template_eng = help[card.data.template];
                if (template_eng == "other")
                    this.field_cards.treasures[template_eng].push(card);
                else {
                    let count = 1;
                    if (card.data.template == '2 Руки')
                        count = 2
                    else if (card.data.template == '3 Руки')
                        count = 3
                    if (this.field_cards.treasures[template_eng]
                        && this.field_cards.treasures.count[template_eng] < this.field_cards.treasures[template_eng].length + count) {
                        const tmp = this.field_cards.treasures[template_eng]
                        while (tmp.length)
                            game.Card.toSbros(this.field_cards.treasures[template_eng].pop())
                    }
                    this.field_cards.treasures[template_eng] = [card];
                }
                game.Player.logging(`${this.player.name} надевает ${card.abstractData.name} (+${card.strong} бонус)`)
            }
            if (card.data.treasureType == 'Используемая') {
                card.defs?.action(defs);
                game.Player.logging(`${this.player.name} использует ${card.abstractData.name} (${card.defs.log_txt ?? ''})`)
                game.Card.toSbros(card);
            }
            if (card.data.treasureType == 'Боевая') {
                if (!game.is_fight) return
                // ????????????????
                // card.defs.action(defs);
                game.Player.logging(`${this.player.name} использует ${card.abstractData.name} (${card.defs.log_txt ?? ''})`);
                game.field.fight.cards.players.push(card); // Выбор стороны
                this.game.Fight.refreshFight();
                game.Card.toSbros(card);
            }
        }
        else {
            if (card.abstractData.cardType == "Класс" || card.abstractData.cardType == "Раса") {
                if (game.is_fight) return
                if (card.is_super) {
                    if (card.abstractData.cardType == "Класс")
                        this.field_cards.doors.classes.bonus = card;
                    else if (card.abstractData.cardType == "Раса")
                        this.field_cards.doors.rasses.bonus = card;
                }
                else {
                    if (card.abstractData.cardType == "Класс")
                        this.field_cards.doors.classes.first = card;
                    else if (card.abstractData.cardType == "Раса")
                        this.field_cards.doors.rasses.first = card;
                }
                game.Player.logging(this.player.name + " теперь " + card.abstractData.name)
            }
            else if (card.abstractData.cardType == "Монстр") {
                if (game.step != 1) return // только для чистки нычек
                game.step++;
                game.Fight.startFight(this, card)
            }
            // else if (card.abstractData.cardType == "Проклятие") { }
        }
        this.delCard(card); // Удаление карты из руки
        game.Player.allPlayersRefresh();
    }

    useCardMesto(body: cardMestoEvent) {
        const durak = ["first", "second",]; // "bonus"
        if (!durak.includes(body.mesto)) return;

        const card = this.cardById(body.id_card)
        const game = this.player.position as MunchkinGame;
        if (!card || !game) {
            this.player.socket.emit('error', 'Ошибка использования карты')
            return
        };
        if (card instanceof DoorCard) {
            let tmp: _fieldDoorCards | undefined;
            if (card.abstractData.cardType == "Класс") tmp = this.field_cards.doors.classes;
            else if (card.abstractData.cardType == "Раса") tmp = this.field_cards.doors.rasses;
            if (!tmp) {
                this.player.socket.emit('error', 'Ошибка использования карты')
                console.log('Ошибка использования карты');
                return
            }
            tmp[body.mesto] = card
            game.Player.logging(this.player.name + " теперь " + card.abstractData.name)
            this.delCard(card); // Удаление карты из руки
        }
        game.Player.allPlayersRefresh();
    }
    useCardOnPlayer(idc: number, pl: string) { // не использовалось
        const card = this.cardById(idc)
        const game = this.player.position as MunchkinGame;
        const target_pl = game.players.find(el => el.player.name)
        if (!card || !game || !target_pl) {
            this.player.socket.emit('error', 'Ошибка использования карты')
            return
        };
        const params = target_pl.defsForCard;
        card.defs.action(params);
        game.Player.logging(this.player.name + " использует " + card.abstractData.name + " на " + target_pl.player.name);
    }
    sbrosCard(id: number) {
        const card = this.cardById(id);
        const game = this.game;
        if (!card || !game
            || game.step != 3
        ) return;
        this.cards.splice(this.cards.indexOf(card), 1);
        game.Card.toSbros(card); // самому мелкому уровню потом
        game.Player.onePlayerRefresh(this);
    }
    sbrosEquip(id: number) {
        let card: TreasureCard | DoorCard = this.field_cards.treasures.findAndDel(id);
        if (!card) card = this.field_cards.doors.findAndDel(id);
        const game = this.game;
        if (!card || !game
            || !game.is_fight
        ) return;
        game.Card.toSbros(card);
        game.Player.logging(this.player.name + " сбрасывает " + card.abstractData.name);
        game.Player.onePlayerRefresh(this);
    }
    sellCard(id: number) {
        const card = this.cardById(id);
        if (!card || !card.abstractData.cost) return;
        this.delCard(card);
        this.game.Card.toSbros(card);
        this.coins += card.abstractData.cost;
        const lvls = Math.floor(this.coins / 1000);
        this.changeLvl(lvls);
        this.coins -= lvls * 1000;
        this.game.Player.logging(this.player.name + " продаёт " + card.abstractData.name + " за " + card.abstractData.cost + " монет" + (lvls ? " и получает " + lvls + " уровней" : ""))
        this.game.Player.allPlayersRefresh();
    }
}
export interface cardMestoEvent {
    id_card: number,
    mesto: "first" | "second" | "bonus"
}