import { Injectable } from '@nestjs/common';
import { CreateFlashcardDeckDto } from './dto/create-flashcard.dto';  
import { PrismaClient } from '@prisma/client';


@Injectable()
export class FlashcardsService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getAllFlashcards() {
    return [
      {
        id: 1,
        title: 'Flashcard 1',
        description: 'This is flashcard 1',
      },
      {
        id: 2,
        title: 'Flashcard 2',
        description: 'This is flashcard 2',
      },
      {
        id: 3,
        title: 'Flashcard 3',
        description: 'This is flashcard 3',
      },
    ];
  }

  createFlashcardDeck({ name, description, flashcards }: CreateFlashcardDeckDto) {
    
    
    const flashcardDeck = this.prisma.flashcardDeck.create({
      data: {
        name,
        description,
        flashcards: {
          createMany: {
            data: flashcards,
          },
        },
      },
      include: {
        flashcards: true,
      },
    });
    return flashcardDeck;
  }
}
