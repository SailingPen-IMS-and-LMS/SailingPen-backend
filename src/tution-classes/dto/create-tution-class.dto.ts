import { IsString, IsNotEmpty, IsArray, IsNumber, IsIn, IsDateString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsSubjectIdValid,
  IsClassNameUnique,
  IsTutorIdValid,
} from '../validators';
import { DayName } from 'src/types/util-types';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateTutionClassDto {
  @ApiProperty()
  @IsClassNameUnique()
  @IsNotEmpty()
  @IsString()
  class_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  class_description: string;

  @ApiProperty()
  @IsNumberString()
  admission_fee: string;

  @ApiProperty()
  @IsNumberString()
  monthly_fee: string;

  @ApiProperty()
  @IsSubjectIdValid()
  @IsNotEmpty()
  @IsString()
  subject_id: string;

  @ApiProperty()
  @IsTutorIdValid()
  @IsNotEmpty()
  @IsString()
  tutor_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  day: DayName;


  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time: string;


  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @IsString()
  start_date: string

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @IsString()
  end_date: string

  @IsFile()
  @MaxFileSize(1e7)
  @HasMimeType(['image/jpeg', 'image/png'])
  banner: MemoryStoredFile;
}
