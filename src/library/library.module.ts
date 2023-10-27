import { Module } from '@nestjs/common';
import { UtilsModule } from '../utils/utils.module';
import { LibraryService } from './services/library.service';
import { ResourcesService } from './services/resources.service';
import { LibraryController } from './controllers/library.controller';
import { ResourcesController } from './controllers/resources.controller';

@Module({
  imports: [UtilsModule],
  controllers: [LibraryController, ResourcesController],
  providers: [LibraryService, ResourcesService],
})
export class LibraryModule {}
