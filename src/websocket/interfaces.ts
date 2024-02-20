import { Socket } from 'socket.io';

export class Lobby {
    constructor(name: string, max: number, creator: Socket | undefined, nickname: string) {
        this.name = name;
        this.players = [];
        this.maxPlayers = max;
        this.creator = [creator, nickname];
    }
    private name: string
    private creator: [Socket, string]
    private players: PlayerLobby[]
    private maxPlayers: number

    getRoom(socket: Socket, nickname: string) { // для home
        return {
            name: this.name,
            creator: socket == this.creator[0] || nickname == this.creator[1] ? true : false,
            players: this.players.map((el) => { el.player.name }),
            maxPlayers: this.maxPlayers,
            canIn: this.canIn()
        }
    }
    getPlayersLenght() {
        return {
            count: this.players.length,
            max: this.maxPlayers
        };
    }
    canIn() {
        return this.players.length < this.maxPlayers;
    }
    in(player: PlayerGlobal) {
        if (this.canIn() && player) {
            this.players.push(new PlayerLobby(player))
            player.position = "lobby"
            return true
        }
        else return "Комната переполнена"
    }
}

export class PlayerGlobal {
    constructor(socket: Socket, name: string = "") {
        this.socket = socket
        this.name = name
        this.position = "home"
    }
    socket: Socket;
    name: string;
    position: "home" | "game" | "lobby"
}

class PlayerLobby {
    constructor(player: PlayerGlobal,) {
        this.player = player;
    }
    player: PlayerGlobal
    sex: "Мужчина" | "Женщина" = "Мужчина"
    ready: boolean = false
}