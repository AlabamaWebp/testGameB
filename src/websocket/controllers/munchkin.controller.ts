import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataService } from '../data/data.service';
import { LobbyService } from '../lobby/lobby.service';
import { Lobby, PlayerGlobal } from '../../data/main';
import { MunchkinGame } from 'src/data/munchkin/mucnhkinGame';
import { MunchkinService } from '../munchkin/munchkin.service';
import { cardMestoEvent, cardSideEvent } from 'src/data/munchkin/player';
import { PlayerGame } from 'src/data/munchkin/player';

@WebSocketGateway(3001, {
  cors: { origin: '*', },
})
export class MunchkinGateway // implements OnGatewayConnection, OnGatewayDisconnect 
{
  @WebSocketServer() server: Server;

  constructor(private data: DataService, private lobbys: LobbyService, private games: MunchkinService) { }

//   handleConnection(client: Socket) {
//     this.data.connectClient(client);
//   }
//   handleDisconnect(client: Socket) {
//     this.data.disconnectClient(client)
//   }

  @SubscribeMessage('refreshGame')
  refreshGame(
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.data.getClient(client).position;
    client.emit("refreshGame", game instanceof MunchkinGame ? game.Player.getMainForPlayer(game.getPlayer(client)) : false)
  }

  @SubscribeMessage('allLog')
  allLog(
    @ConnectedSocket() client: Socket,
  ) {
    const pl = this.data.getClient(client);
    if (pl.position instanceof MunchkinGame)
      pl.position.Player.sendAllLog(pl.socket)
    else
      client.emit("refreshGame", false)
  }
  // getDoor endHod activateCard
  @SubscribeMessage('endHod')
  endHod(
    @ConnectedSocket() client: Socket,
  ) {
    let player: PlayerGlobal | PlayerGame = this.data.getClient(client);
    const game = player.position;
    if (game instanceof MunchkinGame) {
      player = game.getPlayer(client);
      game.Action.endHod(player)
    }
  }
  @SubscribeMessage('useCard')
  useCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() id_card: number,
  ) {
    let player: PlayerGlobal | PlayerGame = this.data.getClient(client);
    const game = player.position;
    if (game instanceof MunchkinGame) {
      player = game.getPlayer(client);
      player.useCard(id_card);
    }
  }
  @SubscribeMessage('useCardSide')
  useCardSide(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: cardSideEvent,
  ) {
    let player: PlayerGlobal | PlayerGame = this.data.getClient(client);
    const game = player.position;
    if (game instanceof MunchkinGame) {
      player = game.getPlayer(client);
      player.useCardSide(body);
    }
  }
  @SubscribeMessage('useCardMesto')
  useCardMesto(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: cardMestoEvent,
  ) {
    let player: PlayerGlobal | PlayerGame = this.data.getClient(client);
    const game = player.position;
    if (game instanceof MunchkinGame) {
      player = game.getPlayer(client);
      player.useCardMesto(body);
    }
  }
  @SubscribeMessage('getDoorCardByPlayer')
  getDoorCardByPlayer(
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.data.getClient(client).position;
    if (game instanceof MunchkinGame)
      game.Action.getDoorCardByPlayer(client);
  }
  @SubscribeMessage('pas')
  pas(
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.data.getClient(client).position;
    if (game instanceof MunchkinGame) {
      game.Fight.yaPas(client);
    }
  }
  @SubscribeMessage('smivka')
  smivka(
    @ConnectedSocket() client: Socket,
  ) {
    const game = this.data.getClient(client).position;
    if (game instanceof MunchkinGame) {
      game.Fight.kidokSmivka(client);
    }
  }
  @SubscribeMessage('helpAsk')
  helpAsk(
    @ConnectedSocket() client: Socket,
    @MessageBody() d: { to: string, gold: number }
  ) {
    const game = this.data.getClient(client).position;
    if (game instanceof MunchkinGame)
      game.Event.helpAsk(client, d);
  }
  @SubscribeMessage('helpAnswer')
  helpAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() d: boolean
  ) {
    const game = this.data.getClient(client).position;
    if (game instanceof MunchkinGame) {
      game.Event.helpAnswer(client, d);
    }
  }
  @SubscribeMessage('sbrosCard')
  sbrosCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() d: number
  ) {
    const pl = this.data.getClient(client);
    if (pl.position instanceof MunchkinGame)
      pl.position.getPlayer(client).sbrosCard(d);
  }
  // @SubscribeMessage('sbrosEquip')
  // sbrosEquip(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() d: number
  // ) {
  //   const pl = this.data.getClient(client);
  //   if (pl.position instanceof MunchkinGame)
  //     pl.position.getPlayer(client).sbrosEquip(d);
  // }
  @SubscribeMessage('sellCard')
  sellCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() d: number
  ) {
    const pl = this.data.getClient(client);
    if (pl.position instanceof MunchkinGame)
      pl.position.getPlayer(client).sellCard(d);
  }
  @SubscribeMessage('toHome')
  toHome(
    @ConnectedSocket() client: Socket
  ) {
    const pl = this.data.getClient(client);
    const game = pl.position
    if (game instanceof MunchkinGame) {
      pl.position = "home"
      pl.socket.emit("goTo", "home")
      try {
        game.players.filter(el => el != game.getPlayer(client));
        game.Player.logging(pl.name + " вышел")
        this.games.deleteGame(game);
      }
      catch { console.log("lol") }
    }
  }
}