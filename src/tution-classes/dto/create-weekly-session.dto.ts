import {IsArray, IsDateString, IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateWeeklySessionDto {

    @IsInt()
    video_resource_id:       number

    @IsNotEmpty({each: true})
    @IsInt({each: true})
    @IsArray()
    attachment_ids:     number[]


    @IsNotEmpty()
    @IsString()
    description:     string

    @IsDateString()
    date            :string
}