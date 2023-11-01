import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/create-announcements.dto';

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
      throw new NotFoundException(
        `Tution Class with ID ${tution_class_id} not found`,
      );
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

  //to update announcements
  async updateAnnouncement(
    userId: string,
    announcementId: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const { title, content } = updateAnnouncementDto;

    const tutor = await this.prisma.tutor.findUnique({
      where: { user_id: userId },
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with User ID ${userId} not found`);
    }

    const announcement = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement || announcement.tutor_id !== tutor.tutor_id) {
      throw new NotFoundException(
        `Announcement with ID ${announcementId} not found or not owned by Tutor with User ID ${userId}`,
      );
    }

    const updatedAnnouncement = await this.prisma.announcement.update({
      where: { id: announcementId },
      data: {
        title: title ?? announcement.title,
        content: content ?? announcement.content,
      },
    });

    return updatedAnnouncement;
  }



  //to get announcement details
  async getAnnouncementDetails(
    userId: string, 
    announcementId: number) 
  {
    const tutor = await this.prisma.tutor.findUnique({
      where: { user_id: userId },
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with User ID ${userId} not found`);
    }

    const announcement = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        tutionClass: true,
      },
    });

    if (!announcement || announcement.tutor_id !== tutor.tutor_id) {
      throw new NotFoundException(
        `Announcement with ID ${announcementId} not found or not owned by Tutor with User ID ${userId}`,
      );
    }

    //map the result to match the desired output
    const result = {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      created_at: announcement.created_at,
      updated_at: announcement.updated_at,
      class_name: announcement.tutionClass.class_name,
    };
  
    return result;
  }


  
  //to get announcements by class id
  async getAnnouncementsByClassId(
    userId: string, 
    classId: string) 
    {
    // const tutor = await this.prisma.tutor.findUnique({
    //   where: {
    //     user_id: userId,
    //   },
    // });

    // if (!tutor) {
    //   throw new NotFoundException(`Tutor with User ID ${userId} not found`);
    // }

    const announcements = await this.prisma.announcement.findMany({
      where: {

            tution_class_id: classId,
  

      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        tutionClass: {
          select: {
            class_name: true,
          },
        },
      },
    });

    if (!announcements) {
      throw new NotFoundException(
        `No announcements found for Tutor with ID ${userId} and Class ID ${classId}`,
      );
    }

    // Map the result to match the desired output
    const result = announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      created_at: announcement.created_at,
      // class_name: announcement.tutionClass.class_name,
    }));

    return result;
  }



  
  //to get announcements by tutor id
  async getAnnouncementsByTutorId(userId: string) {
    const announcements = await this.prisma.announcement.findMany({
      where: {
        tutor: {
          user_id: userId,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        created_at: true,
        tutionClass: {
          select: {
            class_name: true,
          },
        },
      },
    });

    if (!announcements) {
      throw new NotFoundException(
        `No announcements found for Tutor with ID ${userId}`,
      );
    }

    // Map the result to match the desired output
    const results = announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      created_at: announcement.created_at,
      class_name: announcement.tutionClass.class_name,
    }));

    return results;
  }
}
