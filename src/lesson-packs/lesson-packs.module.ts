import { Module } from '@nestjs/common';
import { LessonPacksService } from './lesson-packs.service';
import { LessonPacksController } from './lesson-packs.controller';

@Module({
  providers: [LessonPacksService],
  controllers: [LessonPacksController]
})
export class LessonPacksModule {}
