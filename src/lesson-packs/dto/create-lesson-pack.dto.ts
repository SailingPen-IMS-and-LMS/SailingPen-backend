import {IsArray, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsPositive, IsString, MinLength} from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class CreateLessonPackDto {
    @IsNotEmpty()
    @IsString()
    name  : string

    @IsNotEmpty()
    @IsString()
    description : string

    @IsNumberString()
    price       : string

    @IsArray()
    @IsNumberString({}, {each: true})
    resources  : string[]

    @IsFile()
    @MaxFileSize(1e7)
    @HasMimeType(['image/jpeg', 'image/png'])
    cover_image: MemoryStoredFile;

}