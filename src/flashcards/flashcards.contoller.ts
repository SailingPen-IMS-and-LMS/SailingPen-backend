import { Controller, Get } from '@nestjs/common';

@Controller('flashcards')
export class FlashcardsController {
  @Get()
  findAll(): string {
    return 'This action returns all flashcards';
  }
}
