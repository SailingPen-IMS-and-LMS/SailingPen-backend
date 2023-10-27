import {IsArray, IsDateString, IsNotEmpty, IsString} from "class-validator";

export class CreateWeeklySessionDto {

    @IsNotEmpty()
    @IsString()
    video:       string

    @IsNotEmpty({each: true})
    @IsString({each: true})
    @IsArray()
    attachments:     string[]


    @IsNotEmpty()
    @IsString()
    description:     string

    @IsDateString()
    date            :string
}