import { Module } from '@nestjs/common';
import { BarcodeGenerator } from './BarcodeGenerator';
import { FileUploader } from './FileUploader';

@Module({
  providers: [BarcodeGenerator, FileUploader],
  exports: [BarcodeGenerator, FileUploader],
})
export class UtilsModule {}
