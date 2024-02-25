import { Socket } from 'socket.io';

export class Lobby {
    constructor(name: string, max: number, creator: Socket | undefined, nickname: string) {
        this.name = name;
        this.players = [];
        this.maxPlayers = max;
        this.creator = {
            name: nickname,
            socket: creator
        };
    }
    readonly lobby = true;
    readonly name: string
    readonly creator: {name : string, socket: Socket}
    private players: PlayerLobby[]
    private maxPlayers: number

    homeGetRoom(player: PlayerGlobal) { // для home
        return {
            name: this.name,
            creator: player.socket == this.creator.socket || player.name == this.creator.name ? true : false,
            players: this.players.map((el) => el.player.name),
            maxPlayers: this.maxPlayers,
            canIn: this.canIn()
        }
    }
    lobbyGetRoom(player: PlayerGlobal) {
        return {
            name: this.name,
            creator: player.socket == this.creator.socket || player.name == this.creator.name ? true : false,
            players: this.players.map((el) => {
                return {
                    nickname: el.player.name,
                    sex: el.sex,
                    ready: el.ready,
                    you: el.player.name == player.name
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
            player.position = this
            return true
        }
        else return "Комната переполнена"
    }
    out(player: PlayerGlobal) {
        const index = this.players.findIndex(el => el.player == player)
        if (index != -1) {
            this.players.splice(index, 1);
        }
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
    readonly socket: Socket | null;
    name: string;
    position: "nickname" | "home" | "game" | Lobby
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
    outLobby() {
        if (typeof this.position != "string") {
            this.position.out(this);
            this.position = "home";
            return true;
        }
    }
    getPositionStr(): "nickname" | "home" | "game" | "lobby" {
        if (typeof this.position == "string") {
            return this.position
        }
        else if (this.position.lobby) {
            return "lobby"
        }
        else {
            return "game"
        }
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