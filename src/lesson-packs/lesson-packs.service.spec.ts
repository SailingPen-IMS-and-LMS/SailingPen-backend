import { Test, TestingModule } from '@nestjs/testing';
import { LessonPacksService } from './lesson-packs.service';

describe('LessonPacksService', () => {
  let service: LessonPacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonPacksService],
    }).compile();

    service = module.get<LessonPacksService>(LessonPacksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
