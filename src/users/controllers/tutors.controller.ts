import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TutorsService } from '../services/tutors.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { TutorProfile } from 'src/types/users/tutor.types';

@Controller('users/tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('')
  getAllTutors() {
    return this.tutorsService.getTutors();
  }

  @Roles('tutor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('get-profile')
  getTutorProfileByTutor(@Req() req: Request): Promise<TutorProfile> {
    const user = req.user as AuthenticatedUser;
    return this.tutorsService.getTutorProfileById(user.sub);
  }

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('get-list-for-students')
  getTutorListForStudentByStudent(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.tutorsService.getTutorListForStudent(userId);
  }
}
