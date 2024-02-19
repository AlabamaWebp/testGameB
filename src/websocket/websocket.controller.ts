import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HomeService } from './home.service';
import { connectedClients, deleteFromMass, homeClients } from "./interfaces"

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private home: HomeService) { }

  handleConnection(client: Socket) {
    connectedClients.set(client.id, { socket: client, name: "" });
    homeClients.push(client.id)
  }
  handleDisconnect(client: Socket) {
    connectedClients.delete(client.id);
    deleteFromMass(homeClients, client.id)
  }

  sendMessageToClient(clientId: string, message: any, head: string = "message") {
    const client = connectedClients.get(clientId).socket;
    if (client) {
      client.emit(head, message);
    }
  } // кому кому только одному

  broadcastMessage(message: any, head: string = "message") {
    this.server.emit(head, message);
  } // Вообще всем

  refreshHomeFromAll() {
    homeClients.forEach(el => {
      this.sendHomeClients(this.home.getLobbys(connectedClients.get(el).socket, connectedClients.get(el).name), "refreshRooms") 
    })
  }
  sendHomeClients(message: any, head: string = "message") {
    homeClients.forEach(el => {
      this.sendMessageToClient(el, message, head)
    })
  } // только тем что ещё не в комнате или игре

  getNameByClient(client: Socket) {
    return connectedClients.get(client.id).name
  }

  ///////////////// home
  @SubscribeMessage('getLobby')
  getLobby(
    @ConnectedSocket() client: Socket,
  ) {
    return this.home.getLobbys(client, this.getNameByClient(client));
  } // Получить все лобби

  @SubscribeMessage('setName')
  setName(
    @MessageBody() data: string,
    @ConnectedSocket() client1: Socket,
  ) {
    connectedClients.get(client1.id).name = data;
    return true;
  } // хз не тестил .. никнейм поставить

  @SubscribeMessage('createLobby')
  createLobby(
    @MessageBody() data: createRoom,
    @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.home.createLobby(data.name, data.max, client, this.getNameByClient(client));
    return typeof tmp !== "string" ? 
    this.refreshHomeFromAll()
    : tmp;
  } // РАБОТАЕТ

  @SubscribeMessage('deleteLobby')
  deleteLobby(
    @MessageBody() room: string,
    // @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.home.deleteLobby(room);
    return typeof tmp !== "string" ? 
    this.refreshHomeFromAll()
    : tmp;
  } // РАБОТАЕТ

  //////////// room
  @SubscribeMessage('roomIn')
  roomIn(
    @MessageBody() data: string,
    @ConnectedSocket() client1: Socket,
  ) {
    // connectedClients.get(client1.id).name = data;
    return true;
  }

}

interface createRoom {
  name: string
  max: number
}
