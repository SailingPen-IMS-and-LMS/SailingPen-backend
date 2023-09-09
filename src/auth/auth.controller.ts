import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';
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
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      // console.log(req.user);
      const userId = req.user['sub' as keyof Express.User] as string;
      const refreshTokenFromRequest = req.user[
        'refreshToken' as keyof Express.User
      ] as string;
      const { accessToken, refreshToken } =
        await this.authService.refreshTokens(userId, refreshTokenFromRequest);
      // set refresh token in cookie
      res.cookie('refreshToken', refreshToken, {
        // httpOnly: true,
        // path: '/auth/refresh',
        domain: 'localhost',
        // all paths
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      return res.send({ accessToken });
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-dashboard')
  async refreshDashboardTokens(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      // console.log(req.user);
      const userId = req.user['sub' as keyof Express.User] as string;
      const refreshTokenFromRequest = req.user[
        'refreshToken' as keyof Express.User
      ] as string;
      const { accessToken, refreshToken } =
        await this.authService.refreshTokens(userId, refreshTokenFromRequest);

      const user = await this.usersService.getUserTypeById(userId);
      if (!user) {
        throw new UnauthorizedException();
      }

      const { user_type } = user;

      // set refresh token in cookie
      res.cookie('refreshToken', refreshToken, {
        // httpOnly: true,
        // path: '/auth/refresh',
        domain: 'localhost',
        // all paths
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      return res.send({
        accessTokenDashboard: accessToken,
        userType: user_type,
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('student-login')
  async signInStudent(@Body() loginDto: StudentLoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginStudent(loginDto);

    // set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      // httpOnly: true,
      // path: '/auth/refresh',
      domain: 'localhost',
      // all paths
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return res.send({ accessToken, userType: 'student' });
  }

  @HttpCode(HttpStatus.OK)
  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('student-logout')
  logoutStudent(@Req() req: Request) {
    if (req.user) {
      const user = req.user as AuthenticatedUser;
      return this.authService.logoutStudent(user.sub);
    }
  }

  @HttpCode(HttpStatus.CREATED) // 201
  @Post('student-register') // /auth/student-register POST
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
  async loginToDashboard(
    @Body() loginDto: DashboardLoginDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, userType } =
      await this.authService.loginToDashboard(loginDto);
    // set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      // httpOnly: true,
      // path: '/auth/refresh',
      domain: 'localhost',
      // all paths
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return res.send({ accessTokenDashboard: accessToken, userType });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    if (req.user) {
      const user = req.user as AuthenticatedUser;
      return this.authService.logout(user.sub);
    }
  }
}
