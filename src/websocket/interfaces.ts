import { Socket } from 'socket.io';

export class Lobby {
    constructor(name: string, max: number, creator: Socket | undefined) {
        this.name = name;
        this.players = [];
        this.maxPlayers = max;
        this.creator = creator;
    }
    name: string
    creator: Socket
    players: PlayerLobby[]
    maxPlayers: number

    getLobby(socket: Socket) {
        return {
            name: this.name,
            creator: socket == this.creator ? true : false,
            players: this.players,
            maxPlayers: this.maxPlayers
        }
    }
}

class PlayerLobby {
    constructor(name: string, ) {
        this.name = name;
    }
    name: string
    sex: "Мужчина" | "Женщина" = "Мужчина"
    ready: boolean = false
}