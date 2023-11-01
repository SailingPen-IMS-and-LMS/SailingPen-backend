import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsDefined,
} from 'class-validator';

import { 
    IsEmailUnique, 
    IsNicUnique 
} from '../validators';

import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';



export class UpdateStudentDto {

  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsDateString()
  dob?: string;

  @ApiProperty({ required: false })
//   @IsOptional()
  @IsNotEmpty()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsString()
  @IsNicUnique()
  nic?: string;


  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsString()
  f_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsString()
  l_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsString()
  contact_no?: string;

  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsString()
  school?: string;

  @ApiProperty({ required: false })
  @IsOptional()
//   @IsNotEmpty()
  @IsString()
  parent_contact_no?: string;

  // @IsFile()
  // @MaxFileSize(1e7)
  // @HasMimeType(['image/jpeg', 'image/png'])
  @IsOptional()
  avatar?: MemoryStoredFile;
}
