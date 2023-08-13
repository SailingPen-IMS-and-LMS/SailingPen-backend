import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { FileUploader } from 'src/utils/FileUploader';
import { BarcodeGenerator } from 'src/utils/BarcodeGenerator';

@Injectable()
export class UsersService {
  prisma: PrismaClient;

  constructor(
    private readonly fileUploader: FileUploader,
    private readonly barcodeGenerator: BarcodeGenerator,
  ) {
    this.prisma = new PrismaClient();
  }

  getUserByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username: username,
      },
    });
  }

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });
  }

  getStudents() {
    return this.prisma.user.findMany({});
  }

  getStudentByUsername(username: string) {
    return this.prisma.student.findFirst({
      where: {
        user: {
          username,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async createStudent({
    dob,
    parent_contact_no,
    contact_no,
    school,
    address,
    f_name,
    l_name,
    nic,
    password,
    email,
    avatar,
  }: CreateStudentDto) {
    try {
      password = await hash(password, 12);
      const generated_dob = new Date(dob);

      const totalNumberOfStudents = await this.prisma.student.count();
      // Generate username by padding '0' to the left of the total number of students to make it 8 digits
      const username = (totalNumberOfStudents + 1).toString().padStart(8, '0');
      console.log(username);
      const barcode = await this.barcodeGenerator.generateBarcode(username);
      console.log(barcode);

      const createdStudent = await this.prisma.user.create({
        data: {
          username,
          student: {
            create: {
              school,
              parent_contact_no,
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
          user_type: 'student',
        },
      });

      console.log(createdStudent);

      const avatarURL = await this.fileUploader.uploadFile(avatar, {
        folder: 'tutors/avatars',
      });

      console.log(avatarURL);

      const barcodeURL = await this.fileUploader.uploadFileWithFileObject(
        barcode,
        {
          folder: 'tutors/barcodes',
        },
      );

      console.log(barcodeURL);

      return this.prisma.user.update({
        where: {
          user_id: createdStudent.user_id,
        },
        data: {
          avatar: avatarURL,
          student: {
            update: {
              barcode: barcodeURL,
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
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
    email,
    avatar,
  }: CreateTutorDto) {
    try {
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

  async update(userId: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: {
        user_id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });
  }
}
