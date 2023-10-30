import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnnouncementsService {
    constructor(private prisma: PrismaService) {}


}
