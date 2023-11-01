import { 
    IsOptional, 
    IsString, 
    IsArray, 
    IsDate, 
    IsEmail, 
    IsDateString,
    MinLength, 
    MaxLength, 
    Matches
} from 'class-validator';

export class UpdateTutorProfileDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsDateString()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  contact_no?: string;

  @IsArray()
  @IsOptional()
  qualifications?: string[];

  @IsString()
  @IsOptional()
  bank_name?: string;

  @IsString()
  @IsOptional()
  branch_name?: string;

  @IsString()
  @IsOptional()
  account_no?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  f_name?: string;

  @IsString()
  @IsOptional()
  l_name?: string;

  @IsString()
  @IsOptional()
  nic?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  subject_id?: string;
}




//tutor validators advance versions

class UpdateTutorDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  username?: string;

  @IsDate()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9+]{10,15}$/, { message: 'Invalid contact number' })
  contact_no?: string;

  @IsArray()
  @IsOptional()
  qualifications?: string[];

  @IsString()
  @IsOptional()
  bank_name?: string;

  @IsString()
  @IsOptional()
  branch_name?: string;

  @IsString()
  @IsOptional()
  account_no?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  f_name?: string;

  @IsString()
  @IsOptional()
  l_name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{10}V$/, { message: 'Invalid NIC' })
  nic?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  confirm_password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  subject_id?: string;
}