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
    players: PlayerLobby[]
    private maxPlayers: number

    getRooms(socket: Socket, nickname: string) { // для home
        return {
            name: this.name,
            creator: socket == this.creator[0] || nickname == this.creator[1] ? true : false,
            players: this.players.map((el) => {el.player.name}),
            maxPlayers: this.maxPlayers
        }
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
    constructor(player: PlayerGlobal, ) {
        this.player = player;
    }
    player: PlayerGlobal
    sex: "Мужчина" | "Женщина" = "Мужчина"
    ready: boolean = false
}