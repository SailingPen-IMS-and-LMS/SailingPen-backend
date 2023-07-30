import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

/**
 * To check if the email is already existing in a user account
 * @param validationOptions
 * @constructor
 */
export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingEmailValidation,
    });
  };
}

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class NotExistingEmailValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.user
      .findFirst({ where: { email: value } })
      .then((user) => {
        if (user) {
          throw new UnprocessableEntityException('Email already exists');
        } else {
          return true;
        }
      });
  }
}
