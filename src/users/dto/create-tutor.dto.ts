import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  ArrayNotEmpty,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmailUnique, IsNicUnique, IsUsernameUnique } from '../validators';

export class PaymentDetailsDTO {
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @IsNotEmpty()
  @IsString()
  branch_name: string;

  @IsNotEmpty()
  @IsString()
  account_no: string;
}

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

  @IsArray({})
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty()
  qualifications: string[];

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDTO)
  @ApiProperty()
  payment_details: PaymentDetailsDTO;
}
