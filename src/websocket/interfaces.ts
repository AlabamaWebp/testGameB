import { Socket } from 'socket.io';

export class Lobby {
    constructor(name: string, max: number, creator: Socket | undefined, nickname: string) {
        this.name = name;
        this.players = [];
        this.maxPlayers = max;
        this.creator = [creator, nickname];
    }
    private name: string
    readonly creator: [Socket, string]
    private players: PlayerLobby[]
    private maxPlayers: number

    homeGetRoom(player: PlayerGlobal) { // для home
        return {
            name: this.name,
            creator: player.socket == this.creator[0] || player.name == this.creator[1] ? true : false,
            players: this.players.map((el) => el.player.name),
            maxPlayers: this.maxPlayers,
            canIn: this.canIn()
        }
    }
    lobbyGetRoom() {
        return {
            name: this.name,
            creator: this.creator[1],
            players: this.players.map((el) => {
                return {
                    nickname: el.player.name,
                    sex: el.sex,
                    ready: el.ready
                }
            }),
            maxPlayers: this.maxPlayers,
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
            if (this.players.find(el => el.player.name == player.name)) {
                return "Вы уже в лобби"
            }
            this.players.push(new PlayerLobby(player))
            player.position = "lobby"
            return true
        }
        else return "Комната переполнена"
    }
    getLobbySocket() {
        return this.players.map(el => el.player.socket)
    }
}

export class PlayerGlobal {
    constructor(socket: Socket, name: string = "") {
        this.socket = socket
        this.name = name
        this.position = "nickname"
    }
    socket: Socket;
    name: string;
    position: "nickname" | "home" | "game" | "lobby"
    setName(newNick: string) {
        if (this.position != "nickname" && this.position != "home") {
            return "Сейчас невозможно сменить ник"
        }
        if (typeof newNick !== "string")
            return "Ошибка сервера"
        this.name = newNick;
        this.position = "home"
        return "home";
    }
}

class PlayerLobby {
    constructor(player: PlayerGlobal,) {
        this.player = player;
        this.sex = "Мужчина"
        this.ready = false
    }
    player: PlayerGlobal
    sex: "Мужчина" | "Женщина"
    ready: boolean
}