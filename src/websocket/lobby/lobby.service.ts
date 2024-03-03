import { Injectable } from '@nestjs/common';
import { Lobby, PlayerGlobal } from '../../data/main';
import { Socket } from "socket.io"
import { DataService } from '../data/data.service';
@Injectable()
export class LobbyService {
    // events: refreshLobby,  МОИ ИВЕНТЫ
    constructor(private data: DataService,) {}
    private lobbys: Map<string, Lobby> = new Map();
    getLobbys(player: PlayerGlobal) {
        let tmp: any[] = [];
        this.lobbys.forEach((value: Lobby) => {
            tmp.push(value.homeGetRoom(player));
        })
        return tmp;
    } // По идее готовый вывод лобби

    getOneLobby(name: string) {
        return this.lobbys.get(name);
    }

    createLobby(name: string, max: number, socket: Socket, nickname: string) {
        if (this.lobbys.get(name)) {
            // throw "Уже есть такая комната";
            // return "Уже есть такая комната";
            return "Комната созданная вами уже есть";
        }
        this.lobbys.set(name, new Lobby(name, max, socket, nickname));
        return true;
    } // Создание лобби

    deleteLobby(name: string, client: Socket) {
        const tmp = this.getOneLobby(name);
        const player = this.data.getClientById(client.id)
        if (tmp) {
            if (tmp.getPlayersLenght().count) {
                return "В комнате есть игроки"
            }
            if (player.name !== tmp.creator.name) {
                return "Вы не создатель комнаты"
            }
            this.lobbys.delete(name);
            return true;
        }
        else return "Нет такой комнаты"
    } // Удаление лобби

    refreshOneLobby(roomName: string,) {
        const lobby = this.getOneLobby(roomName);
        lobby?.getLobbySocket().forEach(el => {
            el?.emit("statusLobby", lobby.lobbyGetRoom(this.data.getClientById(el.id)))
        })
    }
    
    lobbyGameStart(roomName: string,) {
        const lobby = this.getOneLobby(roomName);
        lobby?.getLobbySocket().forEach(el => {
            el?.emit("allReady")
        })
        this.lobbys.delete(roomName);
    }

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
