import {IsArray, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MinLength} from "class-validator";

export class CreateLessonPackDto {
    @IsNotEmpty()
    @IsString()
    name  : string

    @IsNotEmpty()
    @IsString()
    description : string

    @IsPositive()
    @IsNumber()
    price       : number

    @IsArray()
    @IsInt({each: true})
    @IsNumber({}, {each: true})
    resources  : number[]
}