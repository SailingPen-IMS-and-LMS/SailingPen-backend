import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsSubjectNameUnique, IsSubjectStreamIdValid } from '../validators';

export class CreateSubjectDto {
  @ApiProperty()
  @IsSubjectNameUnique()
  @IsNotEmpty()
  @IsString()
  subject_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject_description: string;

  @ApiProperty()
  @IsSubjectStreamIdValid({ each: true })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  subject_stream_ids: string[];
}
