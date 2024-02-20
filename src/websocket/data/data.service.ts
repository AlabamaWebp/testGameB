import { Injectable } from '@nestjs/common';
import { Lobby, PlayerGlobal } from '../interfaces';
import { Socket } from 'socket.io';
@Injectable()
export class DataService {
    lobbys: Map<string, Lobby> = new Map();
    connectedClients: PlayerGlobal[] = [];
    homeClients: string[] = [];

    deleteFromMass(mass: string[], ...els: string[]) {
        mass = mass.filter((el) => !els.includes(el))
    }
    connectClient(client: Socket) {
        this.connectedClients.push(new PlayerGlobal(client, ""));
        this.homeClients.push(client.id);
    }
    disconnectClient(client: Socket) {
        this.connectedClients = this.connectedClients.filter(el => el.socket != client);
        this.deleteFromMass(this.homeClients, client.id)
    }
    getClientById(id: string): PlayerGlobal | undefined {
        return this.connectedClients.find(el => el.socket.id == id);
    }
    getClientByName(client: Socket): PlayerGlobal | undefined {
        return this.connectedClients.find(el => el.socket == client)
    }
    setClientName(id: string, newName: string) {
        const client = this.getClientById(id);
        if (client && client.position == "home") {
            client.name = newName;
            return true
        }
        return false
    }
}
