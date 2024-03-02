import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { Game } from 'src/data/mucnhkin';

@Injectable()
export class MunchkinService {
    constructor(private data: DataService,) {}
    private games: Map<string, Game> = new Map();
    createGame(game: Game) {
        if (!this.games.has(game.name)) {
            this.games.set(game.name, game);
            game.players.forEach(el => {
                el.player.position = game;
            })
        }
        else {
            throw "Ошибка создания комнаты"
        }
    }
}
