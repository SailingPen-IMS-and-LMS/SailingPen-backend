import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FileUploader } from 'src/utils/FileUploader';
import { BarcodeGenerator } from 'src/utils/BarcodeGenerator';

@Module({
  providers: [UsersService, FileUploader, BarcodeGenerator],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
