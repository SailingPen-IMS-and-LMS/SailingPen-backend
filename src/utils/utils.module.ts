import { Module } from '@nestjs/common';
import { BarcodeGenerator } from './BarcodeGenerator';
import { FileUploader } from './FileUploader';
import {DateUtils} from "./DateUtils"

@Module({
  providers: [BarcodeGenerator, FileUploader, DateUtils],
  exports: [BarcodeGenerator, FileUploader, DateUtils],
})
export class UtilsModule {}
