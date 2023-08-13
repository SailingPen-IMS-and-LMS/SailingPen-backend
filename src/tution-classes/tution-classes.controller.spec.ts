import { Test, TestingModule } from '@nestjs/testing';
import { TutionClassesController } from './tution-classes.controller';

describe('TutionClassesController', () => {
  let controller: TutionClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutionClassesController],
    }).compile();

    controller = module.get<TutionClassesController>(TutionClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
