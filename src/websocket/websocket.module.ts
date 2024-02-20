import { Module } from '@nestjs/common';
import { MyGateway } from './websocket.controller';
import { HomeService } from './home.service';
import { DataService } from './data/data.service';


@Module({
  providers: [MyGateway, HomeService, DataService],
})
export class WebsocketModule {}