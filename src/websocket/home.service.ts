import { Injectable } from '@nestjs/common';
import { Lobby } from "./interfaces"
import { Socket } from 'socket.io';
import { DataService } from './data/data.service';
@Injectable()
export class HomeService {
    constructor(private data: DataService) {}
    getLobbys(socket: Socket, nickname: string) {
        let tmp: any[] = [];
        this.data.lobbys.forEach((value: Lobby) => {
            tmp.push(value.getRooms(socket, nickname));
        })
        return tmp;
    } // По идее готовый вывод лобби
    
    createLobby(name: string, max: number, socket: Socket, nickname: string) {
        if (this.data.lobbys.get(name)) {
            // throw "Уже есть такая комната";
            return "Уже есть такая комната";
        }
        this.data.lobbys.set(name, new Lobby(name, max, socket, nickname));
        return true;
    } // Создание лобби

    deleteLobby(name: string) {
        const tmp = this.data.lobbys.get(name);
        if (tmp) {
            if (tmp.players.length) {
                return "В комнате есть игроки"
            }
            this.data.lobbys.delete(name);
            return true;
        }
        else return "Нет такой комнаты"
    } // Удаление лобби

    roomIn() { // Войти в лобби

    }
}

