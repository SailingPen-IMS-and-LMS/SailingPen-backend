import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

/**
 * To check if the subject name already exists
 * @param validationOptions
 * @constructor
 */
export function IsSubjectNameUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingSubjectNameValidation,
    });
  };
}

@ValidatorConstraint({ name: 'subject_name', async: true })
@Injectable()
export class NotExistingSubjectNameValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.subject
      .findFirst({ where: { subject_name: value } })
      .then((subject) => {
        if (subject) {
          throw new UnprocessableEntityException('Subject already exists');
        } else {
          return true;
        }
      });
  }
}
