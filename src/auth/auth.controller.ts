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
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { CreateTutorDto } from '../users/dto/create-tutor.dto';
import { DashboardLoginDto } from './dto/dashboard-login.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateAdminDto } from 'src/users/dto/create-admin-dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthenticatedUser } from './types/jwt.types';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

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

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('student-logout')
  logoutStudent(@Req() req: Request) {
    if (req.user) {
      const user = req.user as AuthenticatedUser
      return this.authService.logoutStudent(
        user.sub
      );
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('student-register')
  @FormDataRequest()
  registerAsStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.authService.registerStudent(createStudentDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('tutor-register')
  @FormDataRequest()
  registerAsTutor(@Body() createTutorDto: CreateTutorDto) {
    console.log(createTutorDto);
    return this.authService.registerTutor(createTutorDto);
  }


  @HttpCode(HttpStatus.CREATED)
  @Post('admin-register')
  @FormDataRequest()
  registerAsAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createAdmin(createAdminDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginToDashboard(@Body() loginDto: DashboardLoginDto) {
    return this.authService.loginToDashboard(loginDto);
  }
}
