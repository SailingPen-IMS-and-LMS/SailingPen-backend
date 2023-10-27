import { Test, TestingModule } from '@nestjs/testing';
import { LessonPacksController } from './lesson-packs.controller';

describe('LessonPacksController', () => {
  let controller: LessonPacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonPacksController],
    }).compile();

    controller = module.get<LessonPacksController>(LessonPacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
