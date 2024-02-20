import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataService } from './data/data.service';
import { LobbyService } from './lobby/lobby.service';
import { PlayerGlobal } from './interfaces';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private data: DataService, private lobbys: LobbyService) { }

  // refreshRooms 
  handleConnection(client: Socket) {
    this.data.connectClient(client);
  }
  handleDisconnect(client: Socket) {
    this.data.disconnectClient(client)
  }

  // broadcastMessage(message: any, head: string = "message") {
  //   this.server.emit(head, message);
  // } // Вообще всем

  refreshHomeFromAll() {
    this.data.getHomeClients().forEach(el => {
      try {
        this.data.sendMessageToClient(el.socket,
          this.lobbys.getLobbys(el),
          "refreshRooms")
      }
      catch { throw "Ошибка в refreshHomeFromAll " + el; }
    })
  } /// Обновить всем лобби
  sendHomeClients(message: any, head: string = "message") {
    this.data.getHomeClients().forEach((el) => {
      this.data.sendMessageToClient(el.socket, message, head)
    })
  } // только тем что ещё не в комнате или игре 

  ///////////////// home
  @SubscribeMessage('getLobbys')
  getLobby(
    @ConnectedSocket() client: Socket,
  ) {
    return this.lobbys.getLobbys(this.data.getClientById(client.id));
  } // Получить все лобби

  @SubscribeMessage('setName')
  setName(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.data.setClientName(client.id, name);
  } // хз не тестил .. никнейм поставить

  @SubscribeMessage('createLobby')
  createLobby(
    @MessageBody() data: createRoom,
    @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.lobbys.createLobby(data.name, data.max, client, this.data.getClientById(client.id).name);
    return typeof tmp !== "string" ?
      this.refreshHomeFromAll()
      : tmp;
  } // РАБОТАЕТ

  @SubscribeMessage('deleteLobby')
  deleteLobby(
    @MessageBody() room: string,
    // @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.lobbys.deleteLobby(room);
    return typeof tmp !== "string" ?
      this.refreshHomeFromAll()
      : tmp;
  } // РАБОТАЕТ

  //////////// room
  @SubscribeMessage('roomIn')
  roomIn(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    // connectedClients.get(client1.id).name = data;
    const tmp = this.lobbys.roomIn(client, roomName)
    if (tmp === true) {
      this.lobbys.refreshOneLobby(roomName);
      this.refreshHomeFromAll();
    }
    return tmp;
  }

}

interface createRoom {
  name: string
  max: number
}
