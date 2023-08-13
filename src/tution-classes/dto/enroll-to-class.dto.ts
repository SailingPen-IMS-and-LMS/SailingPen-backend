import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {IsClassIdValid, IsStudentIdValid} from "../validators"


export class EnrollToClassDto {

    @ApiProperty()
    @IsClassIdValid()
    @IsNotEmpty()
    @IsString()
    class_id: string;

    @ApiProperty()
    @IsStudentIdValid()
    @IsNotEmpty()
    @IsString()
    student_id: string;

}
