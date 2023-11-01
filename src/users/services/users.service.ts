import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateStudentDto } from '../dto/create-student.dto';
import { FileUploader } from 'src/utils/FileUploader';
import { BarcodeGenerator } from 'src/utils/BarcodeGenerator';
import { CreateAdminDto } from '../dto/create-admin-dto';
import { StudentProfile } from 'src/types/users/students.types';
import { AdminProfile } from 'src/types/users/admin.types';
import { PrismaService } from '../../prisma.service';
import { UpdateStudentByAdminDto } from '../dto/update-student.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly fileUploader: FileUploader,
    private readonly barcodeGenerator: BarcodeGenerator,
    private readonly prisma: PrismaService,
  ) {}

  getUserTypeById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        user_type: true,
      },
    });
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
    return this.prisma.user.findMany({
      where: {
        user_type: 'student',
      },
      include: {
        student: true,
      },
    });
  }

  async getTutors() {
    const rawTutors = await this.prisma.tutor.findMany({
      select: {
        tutor_id: true,
        subject: {
          select: {
            subject_name: true,
          },
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

  getStudentByUserId(userId: string) {
    return this.prisma.student.findFirst({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
      },
    });
  }

  async getStudentProfileById(userId: string): Promise<StudentProfile> {
    try {
      const rawStudent = await this.prisma.student.findFirst({
        where: { user_id: userId },
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

      if (!rawStudent) {
        throw new Error('Student not found');
      }
      const { user, ...otherStudentDetails } = rawStudent;

      return {
        ...otherStudentDetails,
        ...user,
        dob: user.dob.toDateString(),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAdminProfileById(userId: string): Promise<AdminProfile> {
    try {
      const rawAdmin = await this.prisma.administrator.findFirst({
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

      if (!rawAdmin) {
        throw new Error('Admin not found');
      }
      const { user, ...otherStudentDetails } = rawAdmin;

      return {
        ...otherStudentDetails,
        ...user,
        dob: user.dob.toDateString(),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  //to create student
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
    confirm_password,
    email,
    avatar,
    terms,
  }: CreateStudentDto) {
    if (password !== confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    if (!terms) {
      throw new BadRequestException('Terms and conditions not accepted');
    }

    password = await hash(password, 12);
    const generated_dob = new Date(dob);

    const totalNumberOfStudents = await this.prisma.student.count();
    // Generate username by padding '0' to the left of the total number of students to make it 8 digits
    const username = (totalNumberOfStudents + 1).toString().padStart(8, '0');
    const barcode = await this.barcodeGenerator.generateBarcode(username);

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

    const avatarURL = await this.fileUploader.uploadFile(avatar, {
      folder: 'tutors/avatars',
    });

    const barcodeURL = await this.fileUploader.uploadFileWithFileObject(
      barcode,
      {
        folder: 'tutors/barcodes',
      },
    );

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
  }

  async createAdmin({
    dob,
    contact_no,
    address,
    username,
    f_name,
    l_name,
    nic,
    password,
    email,
    avatar,
  }: CreateAdminDto) {
    try {
      password = await hash(password, 12);
      const generated_dob = new Date(dob);

      const createdUser = await this.prisma.user.create({
        data: {
          username,
          dob: generated_dob,
          address,
          nic,
          password,
          email,
          f_name,
          l_name,
          contact_no,
          user_type: 'admin',
        },
      });

      await this.prisma.administrator.create({
        data: {
          user_id: createdUser.user_id,
        },
      });

      const avatarURL = await this.fileUploader.uploadFile(avatar, {
        folder: 'admins/avatars',
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

    return tutors.map((tutor) => {
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

  //update student's profile
  async updateStudent(updateStudentDto: any, studentId: string) {
    try {
      // console.log(updateStudentDto);
      // console.log(studentId);

      const student = await this.prisma.student.findUnique({
        where: {
          student_id: studentId,
        },
        include: { user: true },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      const {
        username,
        dob,
        parent_contact_no,
        contact_no,
        school,
        address,
        f_name,
        l_name,
        nic,
      } = updateStudentDto;

      const generated_dob = new Date(dob);

      const updatedStudent = await this.prisma.user.update({
        where: {
          user_id: student.user.user_id,
        },
        data: {
          student: {
            update: {
              school: school ?? student.school,
              parent_contact_no: parent_contact_no ?? student.parent_contact_no,
            },
          },
          username: username !== student.user.username ? username : undefined,
          dob: dob ? generated_dob : student.user.dob,
          address: address ?? student.user.address,
          nic: nic !== student.user.nic ? nic : undefined,
          f_name: f_name ?? student.user.f_name,
          l_name: l_name ?? student.user.l_name,
          contact_no:
            contact_no !== student.user.contact_no ? contact_no : undefined,
        },
        select: {
          nic: true,
          f_name: true,
          l_name: true,
          username: true,
          email: true,
          dob: true,
          address: true,
          contact_no: true,
          avatar: true,
          student: {
            select: {
              student_id: true,
              school: true,
              parent_contact_no: true,
            },
          },
        },
      });

      // if (avatar) {
      //   const avatarURL = await this.fileUploader.uploadFile(avatar, {
      //     folder: 'students/avatars',
      //   });

      //   await this.prisma.user.update({
      //     where: {
      //       user_id: student.user.user_id,
      //     },
      //     data: {
      //       avatar: avatarURL,
      //     },
      //   });
      // }

      return updatedStudent;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  //update student's profile by admin
  async updateStudentByAdmin(updateStudentDto: any, studentId: string) {
    try {
      // console.log(updateStudentDto);
      // console.log(studentId);

      const student = await this.prisma.student.findUnique({
        where: {
          student_id: studentId,
        },
        include: { user: true },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      const {
        username,
        dob,
        parent_contact_no,
        contact_no,
        school,
        address,
        f_name,
        l_name,
        nic,
        email,
        password,
      } = updateStudentDto;

      // Check if the nic already exists in the database
      const existingNic = await this.prisma.user.findUnique({
        where: { 
          nic: nic 
        },
      });

      if (existingNic && existingNic.user_id !== student.user.user_id) {
        throw new ConflictException(`NIC ${nic} already exists`);
      }

      // Check if the email already exists in the database
      const existingEmail = await this.prisma.user.findUnique({
        where: {
           email: email 
          },
      });

      if (existingEmail && existingEmail.user_id !== student.user.user_id) {
        throw new ConflictException(`Email ${email} already exists`);
      }

      const generated_dob = new Date(dob);

      const hashedPassword = await hash(password, 12);

      const updatedStudent = await this.prisma.user.update({
        where: {
          user_id: student.user.user_id,
        },
        data: {
          student: {
            update: {
              school: school ?? student.school,
              parent_contact_no: parent_contact_no ?? student.parent_contact_no,
            },
          },
          username: username !== student.user.username ? username : undefined,
          dob: dob ? generated_dob : student.user.dob,
          address: address ?? student.user.address,
          nic: nic !== student.user.nic ? nic : undefined,
          f_name: f_name ?? student.user.f_name,
          l_name: l_name ?? student.user.l_name,
          contact_no:
            contact_no !== student.user.contact_no ? contact_no : undefined,
          email: email !== student.user.email ? email : undefined,
          password:
            hashedPassword !== student.user.password
              ? hashedPassword
              : undefined,
        },
        select: {
          nic: true,
          f_name: true,
          l_name: true,
          username: true,
          email: true,
          dob: true,
          address: true,
          contact_no: true,
          avatar: true,
          student: {
            select: {
              student_id: true,
              school: true,
              parent_contact_no: true,
            },
          },
        },
      });

      // if (avatar) {
      //   const avatarURL = await this.fileUploader.uploadFile(avatar, {
      //     folder: 'tutors/avatars',
      //   });

      //   await this.prisma.user.update({
      //     where: {
      //       user_id: student.user.user_id,
      //     },
      //     data: {
      //       avatar: avatarURL,
      //     },
      //   });
      // }

      return updatedStudent;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
