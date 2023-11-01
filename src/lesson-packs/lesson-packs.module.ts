import { Module } from '@nestjs/common';
import { LessonPacksService } from './lesson-packs.service';
import { LessonPacksController } from './lesson-packs.controller';
import {FileUploader} from "../utils/FileUploader"

@Module({
  providers: [LessonPacksService, FileUploader],
  controllers: [LessonPacksController]
})
export class LessonPacksModule {}
