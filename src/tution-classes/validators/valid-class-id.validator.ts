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
export function IsClassIdValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingClassIdValidation,
    });
  };
}

@ValidatorConstraint({ name: 'class_id', async: true })
@Injectable()
export class NotExistingClassIdValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.tutionClass
      .findFirst({ where: { class_id: value } })
      .then((tClass) => {
        if (!tClass) {
          throw new UnprocessableEntityException(`Tution class isn't valid`);
        } else {
          return true;
        }
      });
  }
}
