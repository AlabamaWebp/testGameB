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
        let name: string = client.handshake.headers['name'] as string;
        if (!name) return;
        name = new TextDecoder().decode(new Uint8Array(name.split(",").map(el => Number(el))))
        const tmp = this.clients.find(el => el.name == name)
        if (tmp) {
            tmp.socket = client;
            client.emit("goTo", tmp.getPositionStr())
        }
        else this.clients.push(new PlayerGlobal(client, name));
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
    getHomeClients() {
        return this.clients.filter(el => el.position == "home");
    }
    sendMessageToClient(client: Socket, message: any, head: string = "message") {
        if (client) {
            client.emit(head, message);
        }
    } // кому кому только одному
}
