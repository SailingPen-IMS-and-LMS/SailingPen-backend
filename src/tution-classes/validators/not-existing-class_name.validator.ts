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
export function IsClassNameUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingClassNameValidation,
    });
  };
}

@ValidatorConstraint({ name: 'class_name', async: true })
@Injectable()
export class NotExistingClassNameValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.tutionClass
      .findFirst({ where: { class_name: value } })
      .then((tClass) => {
        if (tClass) {
          throw new UnprocessableEntityException('Class name already exists');
        } else {
          return true;
        }
      });
  }
}
