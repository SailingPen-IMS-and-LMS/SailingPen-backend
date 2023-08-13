import { Module } from '@nestjs/common';
import { TutionClassesService } from './tution-classes.service';
import { TutionClassesController } from './tution-classes.controller';

@Module({
  providers: [TutionClassesService],
  controllers: [TutionClassesController]
})
export class TutionClassesModule {}
