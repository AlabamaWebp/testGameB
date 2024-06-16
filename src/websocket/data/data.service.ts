import { Injectable } from '@nestjs/common';
import { Lobby, PlayerGlobal } from '../../data/main';
import { Socket } from 'socket.io';
@Injectable()
export class DataService {
    clients: PlayerGlobal[] = [];

    getPl() {
        return this.clients.map(el => {
            return {
                name: el.name,
                position: el.position,
                id: el.socket.id
            }
        })
    }

    deleteFromMass(mass: string[], ...els: string[]) {
        mass = mass.filter((el) => !els.includes(el))
    }
    connectClient(client: Socket) {
        const name: string = client.handshake.headers.name as string;
        const tmp = this.clients.find(el => el.name == name)
        if (tmp) {
            tmp.socket = client;
            client.emit("goTo", tmp.getPositionStr())
        }
        else {
            this.clients.push(new PlayerGlobal(client, name));
        }
    }
    disconnectClient(client: Socket) {
        const player = this.getClient(client);
        if (player) {
            const tmp = player.out();
            if (tmp) return
            this.clients = this.clients.filter(el => el.socket != client);
        }
    }
    getClient(id: Socket): PlayerGlobal | undefined {
        const tmp = this.clients.find(el => el.socket == id);
        return tmp;
    }
    // getClientByName(client: Socket): PlayerGlobal | undefined {
    //     return this.clients.find(el => el.socket == client)
    // }
    // setClientName(id: string, newName: string) {
    //     const client = this.getClientById(id);
    //     if (client) {
    //         if (this.clients.filter(el => el != client).find(el => el.name == newName)) { // .filter(el => el != client) test
    //             return "Игрок с таким ником уже есть"
    //         }
    //         else {
    //             return client.setName(newName);
    //         }
    //     }
    //     return "Ошибка сервера"
    // }
    getHomeClients() {
        return this.clients.filter(el => el.position == "home");
    }
    sendMessageToClient(client: Socket, message: any, head: string = "message") {
        if (client) {
            client.emit(head, message);
        }
    } // кому кому только одному
}
