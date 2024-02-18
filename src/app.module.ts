import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WebsocketModule } from './websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [],
  providers: [AppService,],
})
export class AppModule {}
