import { Module } from '@nestjs/common';
import { HomeLobbyGateway } from './controllers/homeLobby.controller';
import { DataService } from './data/data.service';
import { LobbyService } from './lobby/lobby.service';
import { NicknameController } from 'src/http/nickname/nickname.controller';
import { MunchkinService } from './munchkin/munchkin.service';
import { MunchkinGateway } from './controllers/munchkin.controller';


@Module({
  providers: [HomeLobbyGateway, MunchkinGateway, DataService, LobbyService, MunchkinService],
  controllers: [NicknameController]
})
export class WebsocketModule {}