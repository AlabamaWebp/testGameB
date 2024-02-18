import { AppService } from './app.service';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor() {
  }
  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    console.log(this.connectedClients)
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }
  
  sendMessageToClient(clientId: string, message: string) {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit('message', message);
    }
  }

  broadcastMessage(message: string) {
    this.server.emit('message', message);
  }

  /////////////////
  @SubscribeMessage('events')
  getMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string { // : WsResponse<unknown>
    return data;
  }
}
