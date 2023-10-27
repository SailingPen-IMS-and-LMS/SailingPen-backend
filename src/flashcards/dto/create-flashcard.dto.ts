import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlashcardDto {
  @IsString()
  @IsNotEmpty()
  readonly question: string;

  @IsString()
  @IsNotEmpty()
  readonly answer: string;
}


export class CreateFlashcardDeckDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashcardDto)
  readonly flashcards: CreateFlashcardDto[];
}  

