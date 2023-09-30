import { Controller, Get, Post, Body } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDeckDto } from './dto/create-flashcard.dto';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get()
  getAllFlashcards() {
    return this.flashcardsService.getAllFlashcards();
  }

  @Post()
  createFlashcard(@Body() createFlashcardDeckDto: CreateFlashcardDeckDto) {
    return this.flashcardsService.createFlashcardDeck(createFlashcardDeckDto);
  }
}
