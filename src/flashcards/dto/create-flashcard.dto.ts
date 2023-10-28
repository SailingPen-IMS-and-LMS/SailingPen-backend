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

  //add tution class id from scroldown
  @IsString()
  @IsNotEmpty()
  readonly tution_class_id: string;

}  

