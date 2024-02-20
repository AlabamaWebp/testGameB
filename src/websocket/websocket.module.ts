import { Module } from '@nestjs/common';
import { MyGateway } from './websocket.controller';
import { DataService } from './data/data.service';
import { LobbyService } from './lobby/lobby.service';


@Module({
  providers: [MyGateway, DataService, LobbyService],
})
export class WebsocketModule {}