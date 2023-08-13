import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateStudentDto } from '../users/dto/create-student.dto';
import { StudentLoginDto } from './dto/student-login.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { CreateTutorDto } from '../users/dto/create-tutor.dto';
import { DashboardLoginDto } from './dto/dashboard-login.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    console.log('This was called!');
    console.log(req.user);
    if (req.user) {
      console.log(req.user);
      const userId = req.user['sub' as keyof Express.User] as string;
      const refreshToken = req.user[
        'refreshToken' as keyof Express.User
      ] as string;
      return this.authService.refreshTokens(userId, refreshToken);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('student-login')
  signInStudent(@Body() loginDto: StudentLoginDto) {
    return this.authService.loginStudent(loginDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('student-logout')
  logout(@Req() req: Request) {
    if (req.user)
      return this.authService.logoutStudent(
        req.user['sub' as keyof Express.User],
      );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('student-register')
  registerAsStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.authService.registerStudent(createStudentDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('tutor-register')
  @FormDataRequest()
  registerAsTutor(@Body() createTutorDto: CreateTutorDto) {
    console.log(createTutorDto);
    return this.authService.registerTutor(createTutorDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginToDashboard(@Body() loginDto: DashboardLoginDto) {
    return this.authService.loginToDashboard(loginDto);
  }
}
