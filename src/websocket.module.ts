import { Module } from '@nestjs/common';
import { MyGateway } from './app.controller';


@Module({
  providers: [MyGateway],
})
export class WebsocketModule {}