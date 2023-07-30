import { Controller, Get, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  getAllStudents() {
    return this.usersService.getStudents();
  }

  @Get('students/:username')
  getStudentByUsername(@Param('username') username: string) {
    return this.usersService.getStudentByUsername(username);
  }
}
