import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTutionClassDto } from '../dto/create-tution-class.dto';
import { EnrollToClassDto } from '../dto/enroll-to-class.dto';
import { PrismaService } from '../../prisma.service';
import { Student } from '@prisma/client';
import { FileUploader } from 'src/utils/FileUploader';

@Injectable()
export class TutionClassesService {
  constructor(private readonly prisma: PrismaService, private readonly fileUploader: FileUploader) { }

  getTutionClasses() {
    return this.prisma.tutionClass.findMany({
      include: {
        subject: true,
        tutor: {
          include: {
            user: true
          }
        },
      },
    });
  }

  getMyTutionClasses(userId: string) {
    return this.prisma.tutionClass.findMany({
      where: {
        tutor: {
          user_id: userId,
        },
      },
    });
  }

  async enrolledClassesOfStudent(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        student: {
          user_id: userId
        },
      },
      include: {
        tuition_class: {
          include: {
            tutor: {
              include: {
                user: {
                  select: {
                    f_name: true,
                    l_name: true,
                    avatar: true
                  }
                },
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
    return tutionClasses;
  }

  async createTutionClass({
    class_name,
    class_description,
    admission_fee,
    monthly_fee,
    subject_id,
    tutor_id,
    banner, day, time, end_date, start_date
  }: CreateTutionClassDto) {
    try {

      const banner_url = await this.fileUploader.uploadFile(banner, {folder: 'tution-class-banners'});
      const tutionClass = await this.prisma.tutionClass.create({
        data: {
          class_name,
          class_description,
          subject_id,
          tutor_id,
          admission_fee: +admission_fee,
          monthly_fee: +monthly_fee,
          schedule: {
            day,
            time
          },
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          banner_url
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
      where: {
        class_id,
        student_id
      },
    });
    if (existingEnrollment) {
      throw new UnprocessableEntityException(
        'Student is already enrolled to the class',
      );
    }
    const enrollment = await this.prisma.enrollment.create({
      data: {
        class_id,
        student_id
      },
    });
    return enrollment;
  }

  //get all students enrolled in a class
  async getStudentsEnrolledInClass(classId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        class_id: classId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                f_name: true,
                l_name: true,
                avatar: true
              }
            },
          },
        },
      },
    });
    const students = enrollments.map((enrollment) => {
      const student = enrollment.student;
      const { user, ...studentDetails } = student;
      return {
        ...studentDetails,
        student_id: student.student_id,
        student_f_name: user.f_name,
        student_l_name: user.l_name,
        student_avatar: user.avatar,
        enrolled_date_time: enrollment.enrolled_date_time,

      };
    }
    );
    return students;
  }

}
