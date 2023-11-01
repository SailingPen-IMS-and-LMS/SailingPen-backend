import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Request } from 'express';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { StudentProfile } from 'src/types/users/students.types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminProfile } from 'src/types/users/admin.types';
import { UpdateStudentByAdminDto, UpdateStudentDto } from '../dto/update-student.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  getAllStudents() {
    return this.usersService.getStudents();
  }

  //get student's profile by id
  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('students/get-profile')
  getStudentProfile(@Req() req: Request): Promise<StudentProfile> {
    const user = req.user as AuthenticatedUser;
    return this.usersService.getStudentProfileById(user.sub);
  }

  //get admin's profile by id
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('admins/get-profile')
  getAdminProfile(@Req() req: Request): Promise<AdminProfile> {
    const user = req.user as AuthenticatedUser;
    return this.usersService.getAdminProfileById(user.sub);
  }

  //get student by username
  @Get('students/:username')
  getStudentByUsername(@Param('username') username: string) {
    return this.usersService.getStudentByUsername(username);
  }

  //update student's profile by admin
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('update-student/:id')
  @FormDataRequest()
  async updateStudent(
    @Body() updateStudentDto: UpdateStudentByAdminDto,
    @Param('id') studentId: string,
  ) {
    const updatedStudent = await this.usersService.updateStudentByAdmin(
      updateStudentDto,
      studentId,
    );

    return {
      message: 'Student updated successfully',
      data: updatedStudent,
    };
  }

  //update student's profile by themselves
  @Roles('student')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('update-student')
  @FormDataRequest()
  async updateStudentSelf(
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUser;
    const studentId = user.sub;
    const updatedStudent = await this.usersService.updateStudent(
      updateStudentDto,
      studentId,
    );

    return {
      message: 'Student updated successfully',
      data: updatedStudent,
    };
  }

  //update student's avatar by student
  // @Roles('student')
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // @Patch('update-student-avatar')
  // @FormDataRequest()


}
