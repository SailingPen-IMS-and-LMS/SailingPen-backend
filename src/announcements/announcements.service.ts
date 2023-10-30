import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcements.dto';

@Injectable()
export class AnnouncementsService {
    
    constructor(private prisma: PrismaService) {}

    //to create announcements
    async createAnnouncement(
      userId: string,
      createAnnouncementDto: CreateAnnouncementDto,
    ) {
      const { title, content, tution_class_id } = createAnnouncementDto;
    
      const tutor = await this.prisma.tutor.findUnique({
        where: { user_id: userId },
      });
    
      if (!tutor) {
        throw new NotFoundException(`Tutor with User ID ${userId} not found`);
      }
    
      const tutionClass = await this.prisma.tutionClass.findUnique({
        where: { class_id: tution_class_id },
      });
    
      if (!tutionClass) {
        throw new NotFoundException(`Tution Class with ID ${tution_class_id} not found`);
      }
    
      const announcement = await this.prisma.announcement.create({
        data: {
          title,
          content,
          tutionClass: {
            connect: {
              class_id: tution_class_id,
            },
          },
          tutor: {
            connect: {
              tutor_id: tutor.tutor_id,
            },
          },
        },
      });
    
      return announcement;
    }

}
