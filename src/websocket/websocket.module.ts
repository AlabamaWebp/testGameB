import { Module } from '@nestjs/common';
import { MyGateway } from './websocket.controller';
import { DataService } from './data/data.service';
import { LobbyService } from './lobby/lobby.service';
import { NicknameController } from 'src/http/nickname/nickname.controller';
import { MunchkinService } from './munchkin/munchkin.service';


@Module({
  providers: [MyGateway, DataService, LobbyService, MunchkinService],
  controllers: [NicknameController]
})
export class WebsocketModule {}