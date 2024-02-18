import { Test, TestingModule } from '@nestjs/testing';
import { MyGateway  } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: MyGateway ;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MyGateway ],
      providers: [AppService],
    }).compile();

    appController = app.get<MyGateway >(MyGateway );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
