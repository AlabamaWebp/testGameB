import { Injectable } from '@nestjs/common';
import { Lobby } from '../interfaces';
import { Socket } from "socket.io"
import { DataService } from '../data/data.service';
@Injectable()
export class LobbyService {
    constructor(private data: DataService,) {}
    lobbys: Map<string, Lobby> = new Map();
    getLobbys(socket: Socket, nickname: string) {
        let tmp: any[] = [];
        this.lobbys.forEach((value: Lobby) => {
            tmp.push(value.getRoom(socket, nickname));
        })
        return tmp;
    } // По идее готовый вывод лобби

    getOneLobby(name: string) {
        return this.lobbys.get(name);
    }

    createLobby(name: string, max: number, socket: Socket, nickname: string) {
        if (this.lobbys.get(name)) {
            // throw "Уже есть такая комната";
            return "Уже есть такая комната";
        }
        this.lobbys.set(name, new Lobby(name, max, socket, nickname));
        return true;
    } // Создание лобби

    deleteLobby(name: string) {
        const tmp = this.getOneLobby(name);
        if (tmp) {
            if (tmp.getPlayersLenght().count) {
                return "В комнате есть игроки"
            }
            this.lobbys.delete(name);
            return true;
        }
        else return "Нет такой комнаты"
    } // Удаление лобби

    roomIn(socket: Socket, roomName: string) { // Войти в лобби
        const client = this.data.getClientById(socket.id);
        const lobby = this.getOneLobby(roomName);
        if (!lobby || !client)
            return "Что-то не так"
        else if (client.position !== "home")
            return "Ошибка позиции"
        return lobby.in(client);
    }
}
