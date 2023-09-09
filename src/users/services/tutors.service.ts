import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FileUploader } from 'src/utils/FileUploader';
import { BarcodeGenerator } from 'src/utils/BarcodeGenerator';
import { TutorProfile } from 'src/types/users/tutor.types';
import { CreateTutorDto } from '../dto/create-tutor.dto';
import { hash } from 'bcrypt';

@Injectable()
export class TutorsService {
  prisma: PrismaClient;

  constructor(
    private readonly fileUploader: FileUploader,
    private readonly barcodeGenerator: BarcodeGenerator,
  ) {
    this.prisma = new PrismaClient();
  }

  async getTutors() {
    const rawTutors = await this.prisma.tutor.findMany({
      select: {
        tutor_id: true,
        subject: {
          select: { subject_name: true },
        },
        user: {
          select: {
            f_name: true,
            l_name: true,
            email: true,
            avatar: true,
            created_at: true,
          },
        },
      },
    });

    const tutors = rawTutors.map((rawTutor) => {
      const { tutor_id, subject, user } = rawTutor;
      return {
        tutor_id,
        ...subject,
        ...user,
        created_at: user.created_at.toDateString(),
      };
    });

    return tutors;
  }

  async createTutor({
    dob,
    contact_no,
    qualifications,
    bank_name,
    branch_name,
    account_no,
    address,
    username,
    f_name,
    l_name,
    nic,
    password,
    confirm_password,
    email,
    avatar,
    subject_id,
  }: CreateTutorDto) {
    try {
      if (password !== confirm_password) {
        throw new BadRequestException('Passwords do not match');
      }
      password = await hash(password, 12);
      const generated_dob = new Date(dob);

      const createdUser = await this.prisma.user.create({
        data: {
          username,
          tutor: {
            create: {
              payment_details: JSON.stringify({
                bank_name,
                branch_name,
                account_no,
              }),
              qualifications,
              subject: {
                connect: {
                  subject_id,
                },
              },
            },
          },
          dob: generated_dob,
          address,
          nic,
          password,
          email,
          f_name,
          l_name,
          contact_no,
          user_type: 'tutor',
        },
      });

      const avatarURL = await this.fileUploader.uploadFile(avatar, {
        folder: 'tutors/avatars',
      });

      return this.prisma.user.update({
        where: {
          user_id: createdUser.user_id,
        },
        data: {
          avatar: avatarURL,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getTutorProfileById(userId: string): Promise<TutorProfile> {
    try {
      const rawTutor = await this.prisma.tutor.findFirst({
        where: {
          user_id: userId,
        },
        include: {
          user: {
            select: {
              address: true,
              admin: true,
              avatar: true,
              contact_no: true,
              dob: true,
              email: true,
              f_name: true,
              l_name: true,
              nic: true,
              user_id: true,
              user_type: true,
              username: true,
            },
          },
        },
      });

      if (!rawTutor) {
        throw new Error('Tutor not found');
      }
      const { user, ...otherStudentDetails } = rawTutor;
      return {
        ...otherStudentDetails,
        ...user,
        dob: user.dob.toDateString(),
        payment_details: JSON.parse(
          otherStudentDetails.payment_details?.toString() || '{}',
        ),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getTutorListForStudent(userId: string) {
    const tutors = await this.prisma.tutor.findMany({
      select: {
        tutor_id: true,
        subject: true,
        user: {
          select: {
            f_name: true,
            l_name: true,
            avatar: true,
          },
        },
      },
    });

    const tutorList = tutors.map((tutor) => {
      const subject = tutor.subject?.subject_name;
      const tutor_id = tutor.tutor_id;
      const tutor_f_name = tutor.user.f_name;
      const tutor_l_name = tutor.user.l_name;
      const tutor_avatar = tutor.user.avatar;

      return {
        tutor_id,
        tutor_f_name,
        tutor_l_name,
        tutor_avatar,
        subject,
      };
    });

    return tutorList;
  }
}