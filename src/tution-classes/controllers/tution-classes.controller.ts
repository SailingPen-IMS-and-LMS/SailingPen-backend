import { UsersService } from 'src/users/services/users.service';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TutionClassesService } from '../services/tution-classes.service';
import { CreateTutionClassDto } from '../dto/create-tution-class.dto';
import { EnrollToClassDto } from '../dto/enroll-to-class.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';

@Controller('tution-classes')
export class TutionClassesController {
  constructor(
    private readonly tutionClassesService: TutionClassesService,
    private readonly usersService: UsersService,
  ) {}

  // @Roles('admin')
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  @Get('')
  getTutionClasses() {
    return this.tutionClassesService.getTutionClasses();
  }

  @Roles('admin', 'adminassistant')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('')
  createTutionClass(@Body() createTutionClassDto: CreateTutionClassDto) {
    return this.tutionClassesService.createTutionClass(createTutionClassDto);
  }

  @Roles('admin', 'adminassistant')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('enroll')
  enrollStudentToClass(@Body() enrollToClassDto: EnrollToClassDto) {
    return this.tutionClassesService.enrollStudent(enrollToClassDto);
  }

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('enroll-by-student')
  async enrollStudentToClassByStudent(
    @Body() enrollToClassDto: EnrollToClassDto,
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUser;
    const { sub } = user;
    const { student_id } = enrollToClassDto;
    const foundStudent = await this.usersService.getStudentByUserId(sub);
    if (!foundStudent || foundStudent.student_id !== student_id) {
      throw new ForbiddenException(
        'You are not allowed to enroll other students',
      );
    }
    return this.tutionClassesService.enrollStudent(enrollToClassDto);
  }

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('enrolled')
  getEnrolledClassesOfStudentByStudent(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.tutionClassesService.enrolledClassesOfStudent(userId);
  }

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('not-enrolled')
  getNotEnrolledClassesOfStudentByStudent(
    @Req() req: Request,
    @Query('tutor_id') tutorId: string,
  ) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.tutionClassesService.getClassesForTheStudentToEnrollIn(
      userId,
      tutorId,
    );
  }

  @Roles('tutor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/my-classes')
  getMyTutionClasses(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.tutionClassesService.getMyTutionClasses(userId);
  }
}
