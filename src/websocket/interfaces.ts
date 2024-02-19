import { Socket } from 'socket.io';

export class Lobby {
    constructor(name: string, max: number, creator: Socket | undefined, nickname: string) {
        this.name = name;
        this.players = [];
        this.maxPlayers = max;
        this.creator = [creator, nickname];
    }
    name: string
    creator: [Socket, string]
    players: PlayerLobby[]
    maxPlayers: number

    getRooms(socket: Socket, nickname: string) { // для home
        return {
            name: this.name,
            creator: socket == this.creator[0] && nickname == this.creator[1] ? true : false,
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
export let homeClients: string[] = [];

export function deleteFromMass(mass: string[], ...els: string[]) {
    mass = mass.filter((el) => !els.includes(el))
}