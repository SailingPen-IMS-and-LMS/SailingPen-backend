import { Module } from '@nestjs/common';
import { LibraryService } from './services/library.service';
import { LibraryController } from './controllers/library.controller';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
