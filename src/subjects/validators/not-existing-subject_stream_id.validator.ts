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
export function IsSubjectStreamIdValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingSubjectStreamIdValidation,
    });
  };
}

@ValidatorConstraint({ name: 'subject_stream_id', async: true })
@Injectable()
export class NotExistingSubjectStreamIdValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.subjectStream
      .findFirst({ where: { subject_stream_id: value } })
      .then((stream) => {
        if (!stream) {
          throw new UnprocessableEntityException(`Subject stream isn't valid`);
        } else {
          return true;
        }
      });
  }
}
