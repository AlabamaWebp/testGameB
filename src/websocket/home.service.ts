import { Injectable } from '@nestjs/common';
import { Lobby } from "./interfaces"
import { Socket } from 'socket.io';
@Injectable()
export class HomeService {
    private lobbys: Map <string, Lobby> = new Map();
    constructor() {
        this.lobbys.set("test", new Lobby("test", 1, undefined))
    }
    getLobbys(socket: Socket) {
        let tmp: any[] = [];
        this.lobbys.forEach((value: Lobby) => {
            tmp.push(value.getLobby(socket));
        })
        return tmp;
    } // По идее готовый вывод лобби
    createLobby(name: string, max: number, socket) {
        if (!this.lobbys.get(name))
            return false;
        this.lobbys.set(name, new Lobby(name, max, socket));
        return true;
    } // Создание лобби
}

