import {IsArray, IsDateString, IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateWeeklySessionDto {

    @IsInt()
    video:       number

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