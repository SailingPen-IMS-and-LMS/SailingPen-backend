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
export function IsStudentIdValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingStudentIdValidation,
    });
  };
}

@ValidatorConstraint({ name: 'student_id', async: true })
@Injectable()
export class NotExistingStudentIdValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.student
      .findFirst({ where: { student_id: value } })
      .then((student) => {
        if (!student) {
          throw new UnprocessableEntityException(`Student isn't valid`);
        } else {
          return true;
        }
      });
  }
}
