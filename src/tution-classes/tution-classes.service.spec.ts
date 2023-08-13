import { Test, TestingModule } from '@nestjs/testing';
import { TutionClassesService } from './tution-classes.service';

describe('TutionClassesService', () => {
  let service: TutionClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutionClassesService],
    }).compile();

    service = module.get<TutionClassesService>(TutionClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
