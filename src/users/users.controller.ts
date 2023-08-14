import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {Request} from 'express'
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { StudentProfile } from 'src/types/users/students.types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  getAllStudents() {
    return this.usersService.getStudents();
  }

  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('students/get-profile')
  getStudentProfile(@Req() req:Request): Promise<StudentProfile> {
    const user = req.user as AuthenticatedUser
    return this.usersService.getStudentProfileById(user.sub)
  }

  @Get('students/:username')
  getStudentByUsername(@Param('username') username: string) {
    return this.usersService.getStudentByUsername(username);
  }




}
