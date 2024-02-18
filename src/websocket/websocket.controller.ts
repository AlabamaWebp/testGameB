import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HomeService } from './home.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private home: HomeService) {}

  private connectedClients: Map<string, socketData> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, {socket: client, name: ""});
    this.sendMessageToClient(client.id, "hello");
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
  } // тест

  @SubscribeMessage('setName')
  setName(
    @MessageBody() data: string,
    @ConnectedSocket() client1: Socket,
  ) {
    this.connectedClients.get(client1.id).name = data;
    return true;
  }
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

interface socketData {
  socket: Socket
  name: string
}