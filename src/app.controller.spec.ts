import { Test, TestingModule } from '@nestjs/testing';
import { HomeLobbyGateway  } from './websocket/controllers/homeLobby.controller';
// import { AppService } from './websocket/home.service';

describe('AppController', () => {
  let appController: HomeLobbyGateway ;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HomeLobbyGateway ],
      // providers: [AppService],
    }).compile();

    appController = app.get<HomeLobbyGateway >(HomeLobbyGateway );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
