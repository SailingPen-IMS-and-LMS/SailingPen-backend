import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDeckDto } from './dto/create-flashcard.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get('')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard )
  getAllFlashcards() {
    return this.flashcardsService.getAllFlashcards();
  }


  //to create a flashcard deck 
  @Post()
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard )
  @HttpCode(HttpStatus.CREATED)
  createFlashcard(
    @Req() req: RequestDestination,
    @Body() createFlashcardDeckDto: CreateFlashcardDeckDto) {
    return this.flashcardsService.createFlashcardDeck(createFlashcardDeckDto);
  }
}
