import { Test, TestingModule } from '@nestjs/testing';
import { MunchkinService } from './munchkin.service';

describe('MunchkinService', () => {
  let service: MunchkinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MunchkinService],
    }).compile();

    service = module.get<MunchkinService>(MunchkinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
