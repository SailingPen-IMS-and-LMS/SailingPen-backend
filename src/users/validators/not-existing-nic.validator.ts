import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

/**
 * To check id the nic is unique
 * @param validationOptions
 * @constructor
 */
export function IsNicUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistingNicValidation,
    });
  };
}

@ValidatorConstraint({ name: 'nic', async: true })
@Injectable()
export class NotExistingNicValidation implements ValidatorConstraintInterface {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async validate(value: string): Promise<boolean> {
    return this.prisma.user
      .findFirst({ where: { nic: value } })
      .then((user) => {
        if (user) {
          throw new UnprocessableEntityException('Nic already exists');
        } else {
          return true;
        }
      });
  }
}
