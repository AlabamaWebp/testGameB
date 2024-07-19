import { Injectable } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { MunchkinGame } from 'src/data/munchkin/mucnhkinGame';

@Injectable()
export class MunchkinService {
    constructor(private data: DataService,) { }
    private games: WeakSet<MunchkinGame> = new Set();
    get _games() { return this.games }
    createGame(game: MunchkinGame) {
        if (!this.games.has(game)) {
            this.games.add(game);
            game.players.forEach(el => {
                el.player.position = game;
            })
        }
        else {
            throw "Ошибка создания комнаты"
        }
    }
    deleteGame(game: MunchkinGame) {
        // if (!game.players.length) 
            this.games.delete(game)
    }
}
