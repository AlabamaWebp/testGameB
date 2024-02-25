import { Injectable } from '@nestjs/common';
import { Lobby, PlayerGlobal } from '../interfaces';
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
        // console.log(client.handshake.headers.name);
        this.clients.push(new PlayerGlobal(client, client.handshake.headers.name as string));
    }
    disconnectClient(client: Socket) {
        const player = this.getClientById(client.id);
        if (player.getPositionStr() == "lobby") {
            player.outLobby();
        }
        this.clients = this.clients.filter(el => el.socket != client);
    }
    getClientById(id: string): PlayerGlobal | undefined {
        return this.clients.find(el => el.socket.id == id);
    }
    getClientByName(client: Socket): PlayerGlobal | undefined {
        return this.clients.find(el => el.socket == client)
    }
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
