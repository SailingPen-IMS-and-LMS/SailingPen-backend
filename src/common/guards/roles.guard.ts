import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType, PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../../auth/types/jwt.types';

@Injectable()
export class RolesGuard implements CanActivate {
  prisma: PrismaClient;

  constructor(private reflector: Reflector) {
    this.prisma = new PrismaClient();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest() as Request;
    const user = req.user as AuthenticatedUser;

    return this.checkIfUserIsOfRoles(user.sub, requiredRoles);
  }

  async checkIfUserIsOfRoles(userId: string, roles: UserType[]) {
    const existingUser = await this.prisma.user.findFirst({
      where: { user_id: userId },
    });
    if (!existingUser) return false;
    const userType = existingUser.user_type;
    return roles.includes(userType);
  }
}
