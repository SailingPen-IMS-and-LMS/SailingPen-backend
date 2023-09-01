import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTutionClassDto } from './dto/create-tution-class.dto';
import { EnrollToClassDto } from './dto/enroll-to-class.dto';

@Injectable()
export class TutionClassesService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getTutionClasses() {
    return this.prisma.tutionClass.findMany({
      include: {
        subject: true,
        tutor: { include: { user: true } },
        enrollment: true,
      },
    });
  }

  async enrolledClassesOfStudent(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        student: { user_id: userId },
      },
      include: {
        tuition_class: {
          include: {
            tutor: {
              include: {
                user: { select: { f_name: true, l_name: true, avatar: true } },
              },
            },
          },
        },
      },
    });
    const enrolledClasses = enrollments.map((enrollment) => {
      const tutionClass = enrollment.tuition_class;
      const { user, ...tutor } = tutionClass.tutor;
      return {
        class_id: tutionClass.class_id,
        class_name: tutionClass.class_name,
        tutor_id: tutionClass.tutor_id,
        tutor_f_name: user.f_name,
        tutor_l_name: user.l_name,
        tutor_avatar: user.avatar,
      };
    });
    return enrolledClasses;
  }

  async getClassesForTheStudentToEnrollIn(userId: string, tutorId: string) {
    console.log(`received tutor id ${tutorId} and user id ${userId}`);
    // get all classes, but not the ones that the student is already enrolled in
    const tutionClasses = await this.prisma.tutionClass.findMany({
      where: {
        AND: [
          {
            enrollment: {
              none: {
                student: {
                  user_id: userId,
                },
              },
            },
          },
          {
            tutor_id: tutorId,
          },
        ],
      },
    });
    console.log(tutionClasses);
    return tutionClasses;
  }

  async createTutionClass({
    class_name,
    class_description,
    admission_fee,
    monthly_fee,
    subject_id,
    tutor_id,
  }: CreateTutionClassDto) {
    try {
      const tutionClass = await this.prisma.tutionClass.create({
        data: {
          class_name,
          class_description,
          subject_id,
          tutor_id,
          admission_fee,
          monthly_fee,
        },
      });
      return tutionClass;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async enrollStudent({ class_id, student_id }: EnrollToClassDto) {
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: { class_id, student_id },
    });
    if (existingEnrollment) {
      throw new UnprocessableEntityException(
        'Student is already enrolled to the class',
      );
    }
    const enrollment = await this.prisma.enrollment.create({
      data: { class_id, student_id },
    });
    return enrollment;
  }
}
