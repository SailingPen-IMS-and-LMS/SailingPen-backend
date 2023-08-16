import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {IsSubjectIdValid, IsClassNameUnique, IsTutorIdValid} from "../validators"


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
    @IsNumber()
    admission_fee: number;

    @ApiProperty()
    @IsNumber()
    monthly_fee: number;


    @ApiProperty()
    @IsSubjectIdValid()
    @IsNotEmpty()
    @IsString()
    subject_id: string

    @ApiProperty()
    @IsTutorIdValid()
    @IsNotEmpty()
    @IsString()
    tutor_id: string
}
