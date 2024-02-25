import { Module } from '@nestjs/common';
import { WebsocketModule } from './websocket/websocket.module';
import { DataService } from './websocket/data/data.service';

@Module({
  imports: [WebsocketModule],
})
export class AppModule {}
