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
export function IsSubjectStreamNameUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingSubjectStreamNameValidation,
    });
  };
}

@ValidatorConstraint({ name: 'subject_stream_name', async: true })
@Injectable()
export class NotExistingSubjectStreamNameValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.subjectStream
      .findFirst({ where: { stream_name: value } })
      .then((stream) => {
        if (stream) {
          throw new UnprocessableEntityException('Subject stream already exists');
        } else {
          return true;
        }
      });
  }
}
