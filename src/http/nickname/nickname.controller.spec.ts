import { Test, TestingModule } from '@nestjs/testing';
import { NicknameController } from './nickname.controller';

describe('NicknameController', () => {
  let controller: NicknameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NicknameController],
    }).compile();

    controller = module.get<NicknameController>(NicknameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
