import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

/**
 * To check is the username is correct
 * @param validationOptions
 * @constructor
 */
export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingUsernameValidation,
    });
  };
}

@ValidatorConstraint({ name: 'username', async: true })
@Injectable()
export class NotExistingUsernameValidation
  implements ValidatorConstraintInterface
{
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.user
      .findFirst({ where: { username: value } })
      .then((user) => {
        if (user) {
          throw new UnprocessableEntityException('Username already exists');
        } else {
          return true;
        }
      });
  }
}
