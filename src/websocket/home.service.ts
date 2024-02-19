import { Injectable } from '@nestjs/common';
import { Lobby, lobbys } from "./interfaces"
import { Socket } from 'socket.io';
@Injectable()
export class HomeService {
    private lobbys = lobbys;
    constructor() {
    }
    getLobbys(socket: Socket, nickname: string) {
        let tmp: any[] = [];
        this.lobbys.forEach((value: Lobby) => {
            tmp.push(value.getRooms(socket, nickname));
        })
        return tmp;
    } // По идее готовый вывод лобби
    createLobby(name: string, max: number, socket: Socket, nickname: string) {
        if (this.lobbys.get(name)) {
            // throw "Уже есть такая комната";
            return "Уже есть такая комната";
        }
        this.lobbys.set(name, new Lobby(name, max, socket, nickname));
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

