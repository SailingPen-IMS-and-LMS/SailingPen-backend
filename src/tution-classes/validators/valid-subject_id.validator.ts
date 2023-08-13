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
export function IsSubjectIdValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingSubjectIdValidation,
    });
  };
}

@ValidatorConstraint({ name: 'subject_id', async: true })
@Injectable()
export class NotExistingSubjectIdValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.subject
      .findFirst({ where: { subject_id: value } })
      .then((subject) => {
        if (!subject) {
          throw new UnprocessableEntityException(`Subject isn't valid`);
        } else {
          return true;
        }
      });
  }
}
