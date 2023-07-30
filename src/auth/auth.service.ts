import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { CreateStudentDto } from '../users/dto/create-student.dto';
import { StudentLoginDto } from './dto/student-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerStudent(createStudentDto: CreateStudentDto) {
    const createdStudent = await this.usersService.createStudent(
      createStudentDto,
    );

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
      console.log('Username not found');
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

  async logoutStudent(userId: number) {
    return this.usersService.update(userId, null);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, hashedRefreshToken);
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
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

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refresh_token,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.user_id, user.username);
    await this.updateRefreshToken(user.user_id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
