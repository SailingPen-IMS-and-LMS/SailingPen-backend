import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTutorDto } from './dto/create-tutor.dto';

@Injectable()
export class UsersService {
  prisma: PrismaClient;

  constructor() {
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
    username,
    f_name,
    l_name,
    nic,
    password,
    email,
  }: CreateStudentDto) {
    try {
      password = await hash(password, 12);
      const generated_dob = new Date(dob);

      return this.prisma.user.create({
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
    } catch (e) {
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
  }: CreateTutorDto) {
    try {
      password = await hash(password, 12);
      const generated_dob = new Date(dob);

      return this.prisma.user.create({
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
