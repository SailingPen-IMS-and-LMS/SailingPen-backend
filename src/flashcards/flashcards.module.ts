import { Module } from '@nestjs/common';
import { FlashcardsController } from './flashcards.contoller';
import { FlashcardsService } from './flashcards.service';

@Module({
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
})
export class FlashcardsModule {}
