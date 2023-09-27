import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { TutorsService } from './services/tutors.service';
import { UsersController } from './controllers/users.controller';
import { TutorsController } from './controllers/tutors.controller';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [UsersService, TutorsService],
  controllers: [UsersController, TutorsController],
  exports: [UsersService, TutorsService],
})
export class UsersModule {}
