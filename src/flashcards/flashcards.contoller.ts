import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import {
  CreateFlashcardDeckDto,
  CreateFlashcardDto,
} from './dto/create-flashcard.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/jwt.types';
import type { Request } from 'express';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  // @Get('')
  // @Roles('tutor')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // getAllFlashcards() {
  //   return this.flashcardsService.getAllFlashcards();
  // }

  //to create a flashcard deck
  @Post('')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  createFlashcard(
    @Req() req: Request,
    @Body() createFlashcardDeckDto: CreateFlashcardDeckDto,
  ) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.flashcardsService.createFlashcardDeck(
      userId,
      createFlashcardDeckDto,
    );
  }

  //update flashcard deck details
  @Patch('/update-deck/:id')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateFlashcardDeck(
    @Param('id') flashcardDeckId: number,
    @Body() updateFlashcardDeckDto: CreateFlashcardDeckDto,
  ) {
    return this.flashcardsService.updateFlashcardDeck(
      +flashcardDeckId,
      updateFlashcardDeckDto,
    );
  }

  //to get all flashcard decks for a tutor
  @Get('/flashcard-decks')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFlashcardDecksForUser(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.flashcardsService.getFlashcardDecksForUser(userId);
  }

  //get flashcards of a deck by deckID
  @Get('/flashcard-decks/:id')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFlashcardsByDeckId(
    @Req() req: Request,
    @Param('id') flashcardDeckId: number,
  ) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.flashcardsService.getFlashcardsByDeckId(
      userId,
      +flashcardDeckId,
    );
  }

  //add flashcards to a deck
  @Post(':id/flashcards')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  addFlashcardsToDeck(
    @Param('id') flashcardDeckId: number,
    @Body() createFlashcardDtos: CreateFlashcardDto[],
  ) {
    return this.flashcardsService.addFlashcardsToDeck(
      +flashcardDeckId,
      createFlashcardDtos,
    );
  }

  //update flashcard in flashcard deck
  @Patch('flashcard-deck/:flashcardDeckId/flashcard/:flashcardId/update')
  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  updateFlashcardContent(
    @Param('flashcardDeckId') flashcardDeckId: number,
    @Param('flashcardId') flashcardId: number,
    @Body() updatedContent: CreateFlashcardDto,
  ) {
    return this.flashcardsService.updateFlashcardContent(
      +flashcardDeckId,
      +flashcardId,
      updatedContent,
    );
  }
}
