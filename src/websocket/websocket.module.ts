import { Module } from '@nestjs/common';
import { MyGateway } from './websocket.controller';
import { HomeService } from './home.service';


@Module({
  providers: [MyGateway, HomeService],
})
export class WebsocketModule {}