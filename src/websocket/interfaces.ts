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

    getRooms(socket: Socket) { // для home
        return {
            name: this.name,
            creator: socket == this.creator ? true : false,
            players: this.players.map((el) => {el.name}),
            maxPlayers: this.maxPlayers
        }
    }
}

export class PlayerGlobal {
    constructor(socket: Socket, name: string = "") {
        this.socket = socket
        this.name = name
    }
    socket: Socket;
    name: string;
}

class PlayerLobby {
    constructor(name: string, ) {
        this.name = name;
    }
    name: string
    sex: "Мужчина" | "Женщина" = "Мужчина"
    ready: boolean = false
}

export let lobbys: Map <string, Lobby> = new Map();
export let connectedClients: Map<string, PlayerGlobal> = new Map();