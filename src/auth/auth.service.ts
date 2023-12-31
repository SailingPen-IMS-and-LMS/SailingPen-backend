import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/services/users.service';
import { TutorsService } from '../users/services/tutors.service';
import { compare, hash } from 'bcrypt';
import { CreateStudentDto } from '../users/dto/create-student.dto';
import { StudentLoginDto } from './dto/student-login.dto';
import { CreateTutorDto } from '../users/dto/create-tutor.dto';
import { DashboardLoginDto } from './dto/dashboard-login.dto';
import { CreateAdminDto } from 'src/users/dto/create-admin-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tutorsService: TutorsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerStudent(createStudentDto: CreateStudentDto) {
    const createdStudent =
      await this.usersService.createStudent(createStudentDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { password, ...otherDetails } = createdStudent;

    const tokens = await this.getTokens(
      createdStudent.user_id,
      createdStudent.username,
    );
    await this.updateRefreshToken(createdStudent.user_id, tokens.refreshToken);
    return tokens;
  }

  async loginStudent({ username, password }: StudentLoginDto) {
    const student = await this.usersService.getStudentByUsername(username);
    if (!student) {
      throw new BadRequestException(`Username doesn't exist`);
    }
    // const tokens = await this.getTokens(student.user_id, student.user.username);
    if (!(await compare(password, student.user.password))) {
      throw new BadRequestException('Password is incorrect');
    }
    const tokens = await this.getTokens(student.user_id, student.user.username);
    await this.updateRefreshToken(student.user_id, tokens.refreshToken);
    return tokens;
  }

  async logoutStudent(userId: string) {
    return this.usersService.update(userId, null);
  }

  async logout(userId: string) {
    return this.usersService.update(userId, null);
  }

  async registerTutor(createTutorDto: CreateTutorDto) {
    const createdTutor = await this.tutorsService.createTutor(createTutorDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...otherDetails } = createdTutor;

    return otherDetails;
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const createdAdmin = await this.usersService.createAdmin(createAdminDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...otherDetails } = createdAdmin;
    return otherDetails;
  }

  async loginToDashboard({ username, password }: DashboardLoginDto) {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new BadRequestException(`Username doesn't exist`);
    }
    // const tokens = await this.getTokens(student.user_id, student.user.username);
    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Password is incorrect');
    }
    const tokens = await this.getTokens(user.user_id, user.username);
    await this.updateRefreshToken(user.user_id, tokens.refreshToken);
    return { ...tokens, userType: user.user_type };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, hashedRefreshToken);
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await compare(refreshToken, user.refresh_token);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.user_id, user.username);
    await this.updateRefreshToken(user.user_id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return hash(data, 12);
  }
}
