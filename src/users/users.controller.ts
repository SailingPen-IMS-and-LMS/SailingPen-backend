import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { StudentProfile } from 'src/types/users/students.types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminProfile } from 'src/types/users/admin.types';
import { TutorProfile } from 'src/types/users/tutor.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  getAllStudents() {
    return this.usersService.getStudents();
  }

  // https://localhost:3000/users/students

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('tutors')
  getAllTutors() {
    return this.usersService.getTutors();
  }

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('students/get-profile')
  getStudentProfile(@Req() req: Request): Promise<StudentProfile> {
    const user = req.user as AuthenticatedUser;
    return this.usersService.getStudentProfileById(user.sub);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('admins/get-profile')
  getAdminProfile(@Req() req: Request): Promise<AdminProfile> {
    const user = req.user as AuthenticatedUser;
    return this.usersService.getAdminProfileById(user.sub);
  }

  @Roles('tutor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('tutors/get-profile')
  getTutorProfileByTutor(@Req() req: Request): Promise<TutorProfile> {
    const user = req.user as AuthenticatedUser;
    return this.usersService.getTutorProfileById(user.sub);
  }

  @Get('students/:username')
  getStudentByUsername(@Param('username') username: string) {
    return this.usersService.getStudentByUsername(username);
  }

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('tutors/get-list-for-students')
  getTutorListForStudentByStudent(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    const userId = user.sub;
    return this.usersService.getTutorListForStudent(userId);
  }
}
