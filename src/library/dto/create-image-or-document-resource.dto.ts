import { ApiProperty } from '@nestjs/swagger';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateImageOrDocumentResourceDto {
  @ApiProperty()
  @IsFile()
  @MaxFileSize(1e9)
  @HasMimeType(['image/jpeg', 'image/png', 'application/pdf'])
  file: MemoryStoredFile;
}
