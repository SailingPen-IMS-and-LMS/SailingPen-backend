import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  CreateFlashcardDeckDto,
  CreateFlashcardDto,
} from './dto/create-flashcard.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FlashcardsService {
  constructor(private readonly prisma: PrismaService) {}

  // getAllFlashcards() {
  //   return [
  //     {
  //       id: 1,
  //       title: 'Flashcard 1',
  //       description: 'This is flashcard 1',
  //     },
  //     {
  //       id: 2,
  //       title: 'Flashcard 2',
  //       description: 'This is flashcard 2',
  //     },
  //     {
  //       id: 3,
  //       title: 'Flashcard 3',
  //       description: 'This is flashcard 3',
  //     },
  //   ];
  // }

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
    const { name, description, tution_class_id } = createFlashcardDeckDto;

    const flashcardDeck = await this.prisma.flashcardDeck.create({
      data: {
        name,
        description,
        tutor: {
          connect: {
            user_id: userId,
          },
        },
        tutionClass: {
          connect: {
            class_id: tution_class_id,
          },
        },
      },
    });

    return flashcardDeck;
  }

  async getFlashcardDecksForUser(userId: string) {
    const flashcardDecks = await this.prisma.flashcardDeck.findMany({
      where: {
        tutor: {
          user_id: userId,
        },
      },
    });

    return flashcardDecks;
  }

  async addFlashcardsToDeck(
    flashcardDeckId: number,
    createFlashcardDtos: CreateFlashcardDto[],
  ) {
    const flashcards = await Promise.all(
      createFlashcardDtos.map((createFlashcardDto) =>
        this.prisma.flashcard.create({
          data: {
            question: createFlashcardDto.question,
            answer: createFlashcardDto.answer,
            flashcardDeck: {
              connect: {
                id: flashcardDeckId,
              },
            },
          },
        }),
      ),
    );

    return flashcards;
  }

  async getFlashcardsByDeckId(userId: string, flashcardDeckId: number) {
    const flashcardsDeck = await this.prisma.flashcardDeck.findUnique({
      where: {
        id: flashcardDeckId,
        tutor: {
          user_id: userId,
        },
      },
      //add everything in flashcardDeck as an array
      include: {
        flashcards: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    });

    if (!flashcardsDeck) {
      throw new ForbiddenException(
        'Flashcard deck not found or you dont have access to it ',
      );
    }

    return flashcardsDeck;
  }

  //update flashcard deck
  async updateFlashcardDeck(
    flashcardDeckId: number,
    updateFlashcardDeckDto: CreateFlashcardDeckDto,
  ) {
    const { 
      name, description, tution_class_id } = updateFlashcardDeckDto;

    const flashcardDeck = await this.prisma.flashcardDeck.update({
      where: {
        id: flashcardDeckId,
      },
      data: {
        name,
        description,
        tutionClass: {
          connect: {
            class_id: tution_class_id,
          },
        },
      },
    });

    return flashcardDeck;
  }
}
