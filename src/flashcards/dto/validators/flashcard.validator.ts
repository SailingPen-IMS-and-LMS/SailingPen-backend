import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

export function IsFlashcardDeckNameUnique(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingFlashcardDeckNameValidation,
    });
  };
}

@ValidatorConstraint({ name: 'flashcard_deck_name', async: true })
@Injectable()
export class NotExistingFlashcardDeckNameValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.flashcardDeck
      .findFirst({ where: { name: value } })
      .then((flashcardDeck) => {
        if (flashcardDeck) {
          throw new UnprocessableEntityException(
            'Flashcard Deck name already exists',
          );
        } else {
          return true;
        }
      });
  }
}

export function IsFlashcardQuestionUnique(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingFlashcardQuestionValidation,
    });
  };
}

@ValidatorConstraint({ name: 'flashcard_question', async: true })
@Injectable()
export class NotExistingFlashcardQuestionValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.flashcard
      .findFirst({ where: { question: value } })
      .then((flashcard) => {
        if (flashcard) {
          throw new UnprocessableEntityException(
            'Flashcard question already exists',
          );
        } else {
          return true;
        }
      });
  }
}

export function IsFlashcardDeckDescriptionNotEmpty(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: FlashcardDeckDescriptionNotEmptyValidation,
    });
  };
}

@ValidatorConstraint({ name: 'flashcard_deck_description', async: false })
@Injectable()
export class FlashcardDeckDescriptionNotEmptyValidation
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    if (!value || value.trim().length === 0) {
      throw new UnprocessableEntityException(
        'Flashcard Deck description cannot be empty',
      );
    } else {
      return true;
    }
  }
}

export function IsFlashcardAnswerNotEmpty(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: FlashcardAnswerNotEmptyValidation,
    });
  };
}

@ValidatorConstraint({ name: 'flashcard_answer', async: false })
@Injectable()
export class FlashcardAnswerNotEmptyValidation
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    if (!value || value.trim().length === 0) {
      throw new UnprocessableEntityException(
        'Flashcard answer cannot be empty',
      );
    } else {
      return true;
    }
  }
}
