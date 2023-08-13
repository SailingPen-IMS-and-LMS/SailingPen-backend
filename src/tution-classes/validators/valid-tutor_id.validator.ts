import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

/**
 * To check if the subject stream name already exists
 * @param validationOptions
 * @constructor
 */
export function IsTutorIdValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingTutorIdValidation,
    });
  };
}

@ValidatorConstraint({ name: 'tutor_id', async: true })
@Injectable()
export class NotExistingTutorIdValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.tutor
      .findFirst({ where: { tutor_id: value } })
      .then((tutor) => {
        if (!tutor) {
          throw new UnprocessableEntityException(`Tutor isn't valid`);
        } else {
          return true;
        }
      });
  }
}
