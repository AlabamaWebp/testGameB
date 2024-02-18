import { Injectable } from '@nestjs/common';
import { Lobby, lobbys } from "./interfaces"
import { Socket } from 'socket.io';
@Injectable()
export class HomeService {
    private lobbys = lobbys;
    constructor() {
        this.lobbys.set("test", new Lobby("test", 1, undefined))
    }
    getLobbys(socket: Socket) {
        let tmp: any[] = [];
        this.lobbys.forEach((value: Lobby) => {
            tmp.push(value.getRooms(socket));
        })
        return tmp;
    } // По идее готовый вывод лобби
    createLobby(name: string, max: number, socket: Socket) {
        if (this.lobbys.get(name)) {
            // throw "Уже есть такая комната";
            return "Уже есть такая комната";
        }
        this.lobbys.set(name, new Lobby(name, max, socket));
        return true;
    } // Создание лобби
    deleteLobby(name: string) {
        const tmp = this.lobbys.get(name);
        if (tmp) {
            if (tmp.players.length) {
                return "В комнате есть игроки"
            }
            this.lobbys.delete(name);
            return true;
        }
        else return "Нет такой комнаты"
    } // Создание лобби

    roomIn() { // Войти в лобби

    }
}

