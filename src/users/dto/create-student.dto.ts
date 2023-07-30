import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsDateString } from 'class-validator';
import { IsEmailUnique, IsNicUnique, IsUsernameUnique } from '../validators';

export class CreateStudentDto {
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  school: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  parent_contact_no: string;
}
