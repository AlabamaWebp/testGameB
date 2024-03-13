import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataService } from './data/data.service';
import { LobbyService } from './lobby/lobby.service';
import { Lobby, PlayerGlobal } from '../data/main';
import { Game } from 'src/data/mucnhkin';
import { MunchkinService } from './munchkin/munchkin.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private data: DataService, private lobbys: LobbyService, private games: MunchkinService) { }

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

  // socket.handshake.headers
  @SubscribeMessage('getAllPlayers')
  getPlTest(
    @ConnectedSocket() client: Socket,
  ) {
    return this.data.getPl()
  } // Получить всех подключенных

  ///////////////// home
  @SubscribeMessage('getLobbys')
  getLobby(
    @ConnectedSocket() client: Socket,
  ) {
    client.emit("refreshRooms", this.lobbys.getLobbys(this.data.getClientById(client.id)));
    return true;
  } // Получить все лобби

  @SubscribeMessage('createLobby')
  createLobby(
    @MessageBody() data: createRoom,
    @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.lobbys.createLobby(data.name, data.max, client, this.data.getClientById(client.id).name);

    if (typeof tmp == "string") {
      client.emit("statusCreate", tmp)
    }
    else {
      this.refreshHomeFromAll()
    }
  } // РАБОТАЕТ

  @SubscribeMessage('deleteLobby')
  deleteLobby(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    const tmp = this.lobbys.deleteLobby(room, client);
    return typeof tmp !== "string" ?
      this.refreshHomeFromAll()
      : client.emit("statusDelete", tmp);
  } // РАБОТАЕТ

  //////////// room
  @SubscribeMessage('roomIn')
  roomIn(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    // connectedClients.get(client1.id).name = data;
    const tmp = this.lobbys.roomIn(client, roomName) // Добавляем игрока в комнату, получаем тру или стр ошибки
    if (tmp === true) { // если успешно 
      client.emit("statusRoomIn", true);
      this.lobbys.refreshOneLobby(roomName); // обновляем для всех в команте что появился игрок
      this.refreshHomeFromAll(); // обнорвляем у всех в home что место заняли
    }
    client.emit("statusRoomIn", tmp);
    return tmp;
  }

  @SubscribeMessage('roomOut')
  roomOut(
    // @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    //@ts-ignore
    const position = this.data.getClientById(client.id).getPositionStr();
    if (position == "lobby") {
      //@ts-ignore
      const name = this.data.getClientById(client.id).position.name;
      const tmp = this.data.getClientById(client.id).out();
      if (tmp === true) { // если успешно 
        // client.emit("statusPlayer", this.data.getClientById(client.id)?.getPositionStr())
        this.lobbys.refreshOneLobby(name); // обновляем для всех в команте что удалился игрок
        this.refreshHomeFromAll(); // обнорвляем у всех в home что место заняли
      }
    }
    return;
  }

  @SubscribeMessage('statusLobby')
  statusLobby(
    // @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    const pl = this.data.getClientById(client.id);
    //@ts-ignore
    const tmp = pl.position.lobbyGetRoom(pl);
    client.emit("statusLobby", tmp)
    return tmp;
  }

  @SubscribeMessage('setSex')
  setSex(
    @MessageBody() d: "Мужчина" | "Женщина",
    @ConnectedSocket() client: Socket,
  ) {
    if (typeof d != 'string') {
      return false
    }
    const player = this.data.getClientById(client.id);
    if (player.getPositionStr() == "lobby") {
      const tmp = player.position as Lobby;
      tmp.setSex(client, d);
      this.lobbys.refreshOneLobby(tmp.name);
    }
  }

  @SubscribeMessage('statusPlayer')
  statusPlayer(
    // @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit("statusPlayer", this.data.getClientById(client.id)?.getPositionStr())
    return true;
  }

  @SubscribeMessage('setReady')
  setReady(
    @MessageBody() d: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    if (typeof d != 'boolean') {
      return false
    }
    const player = this.data.getClientById(client.id);
    if (player.getPositionStr() == "lobby") {
      const tmp = player.position as Lobby;
      const game = tmp.setReady(client, d);
      if (game) {
        const lname = tmp.name;
        this.games.createGame(game);
        this.lobbys.lobbyGameStart(lname);
        this.refreshHomeFromAll()
      }
      else {
        this.lobbys.refreshOneLobby(tmp.name);
      }
    }
  }
  // refreshGame plusLog allLog
  @SubscribeMessage('refreshGame')
  refreshGame(
    @ConnectedSocket() client: Socket,
  ) {
    const pl = this.data.getClientById(client.id);
    if (pl.position instanceof Game) {
      client.emit("refreshGame", pl.position.getMainForPlayer(pl))
    }
    else {
      client.emit("refreshGame", false)
    }
  }

  @SubscribeMessage('allLog')
  allLog(
    @ConnectedSocket() client: Socket,
  ) {
    const pl = this.data.getClientById(client.id);
    if (pl.position instanceof Game) {
      pl.position.getAllLog(pl.socket)
    }
    else {
      client.emit("refreshGame", false)
    }
  }
  // getDoor endHod activateCard
  @SubscribeMessage('getDoor')
  getDoor(
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.data.getClientById(client.id).position;
    if (game instanceof Game) {
      game.playerGetClosedDoor(client);
    }
    else {
      client.emit("refreshGame", false)
    }
  }
}

interface createRoom {
  name: string
  max: number
}
