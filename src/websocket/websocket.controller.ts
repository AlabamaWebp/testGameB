import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HomeService } from './home.service';
import { connectedClients } from "./interfaces"

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private home: HomeService) { }

  private connectedClients = connectedClients;

  handleConnection(client: Socket) {
    // console.log(JSON.stringify({
    //   "name": "1",
    //   "max": 2
    // }));
    this.connectedClients.set(client.id, { socket: client, name: "" });
    // this.sendMessageToClient(client.id, "hello");
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  sendMessageToClient(clientId: string, message: string, head: string = "message") {
    const client = this.connectedClients.get(clientId).socket;
    if (client) {
      client.emit(head, message);
    }
  }

  broadcastMessage(message: string, head: string = "message") {
    this.server.emit(head, message);
  }

  ///////////////// home
  @SubscribeMessage('getLobby')
  getLobby(
    @ConnectedSocket() client: Socket,
  ) {
    return this.home.getLobbys(client);
  } // вроде норм

  @SubscribeMessage('setName')
  setName(
    @MessageBody() data: string,
    @ConnectedSocket() client1: Socket,
  ) {
    this.connectedClients.get(client1.id).name = data;
    return true;
  } // хз не тестил
  @SubscribeMessage('createLobby')
  createLobby(
    @MessageBody() data: createRoom,
    @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.home.createLobby(data.name, data.max, client);
    return typeof tmp !== "string" ? this.home.getLobbys(client) : tmp;
  } // РАБОТАЕТ
  @SubscribeMessage('deleteLobby')
  deleteLobby(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.home.deleteLobby(data);
    return typeof tmp !== "string" ? this.home.getLobbys(client) : tmp;
  } // РАБОТАЕТ

  //////////// room
  @SubscribeMessage('roomIn')
  roomIn(
    @MessageBody() data: string,
    @ConnectedSocket() client1: Socket,
  ) {
    // this.connectedClients.get(client1.id).name = data;
    return true;
  }

}

interface createRoom {
  name: string
  max: number
}