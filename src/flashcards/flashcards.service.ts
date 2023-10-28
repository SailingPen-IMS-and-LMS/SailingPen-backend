import { Injectable } from '@nestjs/common';
import { CreateFlashcardDeckDto } from './dto/create-flashcard.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FlashcardsService {
  constructor(private readonly prisma: PrismaService) {}

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

  // createFlashcardDeck({
  //   name,
  //   description,
  //   flashcards,
  // }: CreateFlashcardDeckDto) {
  //   const flashcardDeck = this.prisma.flashcardDeck.create({
  //     data: {
  //       name,
  //       description,
  //       flashcards: {
  //         createMany: {
  //           data: flashcards,
  //         },
  //       },
  //     },
  //     include: {
  //       flashcards: true,
  //     },
  //   });
  //   return flashcardDeck;
  // }

  async createFlashcardDeck(
    userId: string,
    createFlashcardDeckDto: CreateFlashcardDeckDto,
  ) {
    const { name, description, tution_class_id  } = createFlashcardDeckDto;
  
    const flashcardDeck = await this.prisma.flashcardDeck.create({
      data: {
        name,
        description,
        tutor: {
          connect: {
              user_id: userId
          }
        },
        tutionClass: {
          connect: {
            class_id: tution_class_id
          }
        }
      },
    });
  
    return flashcardDeck;
  }

  async getFlashcardDecksForUser(userId: string) {
    const flashcardDecks = await this.prisma.flashcardDeck.findMany({
      where: {
        tutor_id: userId,
      },
    });
  
    return flashcardDecks;
  }
}
