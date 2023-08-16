import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  ArrayNotEmpty,
} from 'class-validator';
import {
  MemoryStoredFile,
  IsFile,
  MaxFileSize,
  HasMimeType,
} from 'nestjs-form-data';
import { IsEmailUnique, IsNicUnique, IsUsernameUnique } from '../validators';
import {IsSubjectIdValid} from 'src/subjects/validators'

export class CreateTutorDto {
  @IsNotEmpty()
  @IsString()
  @IsUsernameUnique()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsNicUnique()
  @ApiProperty()
  nic: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  f_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  l_name: string;

  @IsEmail()
  @IsEmailUnique()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  confirm_password: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  dob: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  contact_no: string;

  @IsFile()
  @MaxFileSize(1e7)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar: MemoryStoredFile;

  @IsArray({})
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty()
  qualifications: string[];


  @IsSubjectIdValid()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  subject_id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  bank_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  branch_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  account_no: string;
}
