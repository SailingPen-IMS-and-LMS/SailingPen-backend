import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FileUploader } from 'src/utils/FileUploader';
import { BarcodeGenerator } from 'src/utils/BarcodeGenerator';
import { TutorProfile } from 'src/types/users/tutor.types';
import { CreateTutorDto } from '../dto/create-tutor.dto';
import { hash } from 'bcrypt';

@Injectable()
export class TutorsService {
  constructor(
    private readonly fileUploader: FileUploader,
    private readonly barcodeGenerator: BarcodeGenerator,
    private readonly prisma: PrismaService,
  ) {}

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
        include: {
          tutor: true,
        },
      });

      const createdFolder = await this.prisma.libraryFolder.create({
        data: {
          name: `${f_name} ${l_name}'s Root Folder - ${createdUser.user_id}`,
          tutor: {
            connect: {
              tutor_id: createdUser.tutor?.tutor_id,
            },
          },
        },
      });

      await this.prisma.library.create({
        data: {
          root_folder_id: createdFolder.id,
          tutor_id: createdUser.tutor?.tutor_id as string,
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

  async getTutorListForStudent() {
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

  //update tutor profile
  async updateTutor(updateTutorDto: any, tutorId: string) {
    try {
      const tutor = await this.prisma.tutor.findUnique({
        where: { 
          tutor_id: tutorId 
        },
        include: { 
          user: true 
        },
      });
  
      if (!tutor) {
        throw new NotFoundException(`Tutor with ID ${tutorId} not found`);
      } 
  
      const {
        username,
        dob,
        contact_no,
        qualifications,
        bank_name,
        branch_name,
        account_no,
        address,
        f_name,
        l_name,
        nic,
        password,
        email,
        subject_id,
      } = updateTutorDto;

      //to check whether the email is already taken
      const emailExists = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (emailExists && emailExists.user_id !== tutor.user.user_id) {
        throw new ConflictException(`Email ${email} already exists`);
      }

      //to check whether the nic is already taken
      const nicExists = await this.prisma.user.findUnique({
        where: {
          nic: nic,
        },
      });
      
      if (nicExists && nicExists.user_id !== tutor.user.user_id) {
        throw new ConflictException(`NIC ${nic} already exists`);
      }


  
      const generated_dob = new Date(dob);
  
      const hashedPassword = await hash(password, 12);
  
      const updatedTutor = await this.prisma.user.update({
        where: {
          user_id: tutor.user.user_id,
        },
        data: {
          username: username !== tutor.user.username ? username : undefined,
          dob: dob ? generated_dob : tutor.user.dob,
          address: address ?? tutor.user.address,
          nic: nic !== tutor.user.nic ? nic : undefined,
          f_name: f_name ?? tutor.user.f_name,
          l_name: l_name ?? tutor.user.l_name,
          contact_no: contact_no !== tutor.user.contact_no ? contact_no : undefined,
          email: email !== tutor.user.email ? email : undefined,
          password: hashedPassword !== tutor.user.password ? hashedPassword : undefined,
          tutor: {
            update: {
              qualifications: qualifications ?? tutor.qualifications,
              payment_details: bank_name && branch_name && account_no ? { 
                bank_name,
                branch_name,
                account_no,
              } : tutor.payment_details ?? {},
              subject: subject_id ? {
                connect: {
                  subject_id,
                },
              } : undefined,
            },
          },
        },
        select: {
          user_id: true,
          nic: true,
          f_name: true,
          l_name: true,
          username: true,
          email: true,
          dob: true,
          address: true,
          contact_no: true,
          tutor: {
            select: {
              tutor_id: true,
              qualifications: true,
              payment_details: true,
              subject_id: true,
            },
          },
        },
      });
  
      return updatedTutor;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
