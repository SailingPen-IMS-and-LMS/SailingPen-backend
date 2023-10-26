import { ApiProperty } from '@nestjs/swagger';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateVideoResourceDto {
  @ApiProperty()
  @IsFile()
  @MaxFileSize(1e9)
  @HasMimeType(['video/mp4'])
  file: MemoryStoredFile;
}
