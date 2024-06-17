import { PlayerGlobal } from "../main";
import { TreasureCard, DoorsCard, cardMestoEvent } from "./cards";
import { fieldTreasureCards, fieldDoorCards } from "./interfaces";
import { Game } from "./mucnhkinGame";

export class PlayerGame {
    constructor(player: PlayerGlobal, sex: "Мужчина" | "Женщина", queue: number) {
        this.lvl = 1;
        this.player = player;
        this.sex = sex;
        this.alive = true;
        this.queue = queue; // Очередь игрока
    }
    readonly queue: number;

    private lvl: number = 1;
    t_field_cards = new fieldTreasureCards(); // Шмотки
    d_field_cards = new fieldDoorCards(); // Классы Рассы

    cards: (TreasureCard | DoorsCard)[] = [];
    private maxCards: number = 5;

    alive: boolean;
    smivka_power: number = 4; // x > 4
    cubik = 0;


    readonly player: PlayerGlobal;
    readonly sex: "Мужчина" | "Женщина";

    get power() {
        let tmp = this.lvl;
        const cards = Object.keys(this.t_field_cards);
        cards.forEach((el: string) => {
            if (this.t_field_cards[el] && el != 'count') {
                this.t_field_cards[el].forEach(card1 => {
                    tmp += card1.strong
                });
            }
        })
        return tmp;
    }

    get data() {
        return {
            name: this.player.name,
            lvl: this.lvl,
            sex: this.sex,
            cards: this.cards.map(el => el.getData()).reverse(),
            t_field: {
                helmet: this.t_field_cards?.helmet?.map(el => el.getData()),
                body: this.t_field_cards?.body?.map(el => el.getData()),
                legs: this.t_field_cards?.legs?.map(el => el.getData()),
                arm: this.t_field_cards?.arm?.map(el => el.getData()),
                other: this.t_field_cards?.other?.map(el => el.getData()),
            }, d_field: {
                rasses: this.d_field_cards?.getRasses(), // ?.map(el => el.getData())
                classes: this.d_field_cards?.getClasses(), // ?.map(el => el.getData())
            },
            queue: this.queue,
            max_cards: this.maxCards,
            power: this.power
        }
    }

    changeLvl(count: number) {
        this.lvl += count;
        if (this.lvl < 1)
            this.lvl = 1;
        if (this.lvl > 10) {
            // победа
        }
        // const game = this.player.position as Game;
        // game.playersGameRefresh();
    }

    useCard(id: number) {
        const card: TreasureCard | DoorsCard = this.cards.find(el => el.id == id);
        const game = this.player.position as Game;
        if (!card || !game) {
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

            'Класс': 'classes',
            'Раса': 'rasses'
        }
        //  "Рядом" 
        // other

        if (card instanceof TreasureCard) {
            const defs = { player: this, game: game }
            if (card.defs?.condition && !card.defs?.condition(defs))
                return // Если не выполнено условие то габелла
            ////////////// 
            if (card.data.treasureType == 'Надеваемая') {

                const template_eng = help[card.data.template]
                let count = 1;
                if (card.data.template == '2 Руки')
                    count = 2
                else if (card.data.template == '3 Руки')
                    count = 3
                if (this.t_field_cards[template_eng]
                    && this.t_field_cards.count[template_eng] < this.t_field_cards[template_eng].length + count) {
                    const tmp = this.t_field_cards[template_eng]
                    while (tmp.length) {
                        game.Card.toSbros(this.t_field_cards[template_eng].pop())
                    }
                }
                // console.log(this.t_field_cards[template_eng], card);
                this.t_field_cards[template_eng] = [card];

                game.Player.logging(`${this.player.name} надевает ${card.abstractData.name} (+${card.strong} бонус)`)
            }
            if (card.data.treasureType == 'Используемая') {
                card.defs?.action(defs);
                game.Player.logging(`${this.player.name} использует ${card.abstractData.name} ${card.defs.log_txt ?? ''}`)
            }
            if (card.data.treasureType == 'Боевая') {
                // ????????????????
                // game.logging(`${this.player.name} использует ${card.abstractData.name} ${card.defs.log_txt ?? ''}`)
            }
            this.cards = this.cards.filter(el => el != card); // Удаление карты из руки
        }
        game.Player.allPlayersRefresh();
    }

    useCardMesto(body: cardMestoEvent) {
        const durak = ["first" , "second" , "bonus"];
        if (!durak.includes(body.mesto)) return;

        const card: TreasureCard | DoorsCard = this.cards.find(el => el.id == body.id_card);
        const game = this.player.position as Game;
        if (!card || !game) {
            this.player.socket.emit('error', 'Ошибка использования карты')
            return
        };
        if (card instanceof DoorsCard) {
            if (card.abstractData.cardType == "Класс") {
                this.d_field_cards.classes[body.mesto] = card;
            }
            else if (card.abstractData.cardType == "Раса") {
                this.d_field_cards.classes[body.mesto] = card;
            }
            this.cards = this.cards.filter(el => el != card); // Удаление карты из руки
        }
        game.Player.allPlayersRefresh();
    }
}