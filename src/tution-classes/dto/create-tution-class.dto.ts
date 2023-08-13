import { IsString, IsNotEmpty, IsArray } from 'class-validator';
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
