import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FileUploader } from 'src/utils/FileUploader';

@Module({
  providers: [UsersService, FileUploader],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
