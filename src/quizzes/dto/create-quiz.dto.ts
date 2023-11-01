import { Type } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsNotEmpty, ValidateNested, ArrayMinSize, ArrayMaxSize, IsArray } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  published: boolean;


  @IsNotEmpty()
  @IsString()
  tution_class_id: string;


}



// class QuestionAnswerDto {
//   @IsNotEmpty()
//   @IsString()
//   text: string;

//   @IsBoolean()
//   is_correct: boolean;
// }

// class QuestionDto {
//   @IsNotEmpty()
//   @IsString()
//   text: string;

//   @IsArray()
//   @ArrayMinSize(4)
//   @ArrayMaxSize(5) // Adjust the max size as needed
//   @IsString({ each: true })
//   @ValidateNested({ each: true })
//   @Type(() => QuestionAnswerDto)
//   answers: QuestionAnswerDto[];
// }

// export class CreateQuestionsDto {
//   @IsArray()
//   @ArrayMinSize(1) // Minimum size of the array
//   @ArrayMaxSize(10) // Maximum size of the array, adjust as needed
//   @ValidateNested({ each: true })
//   @Type(() => QuestionDto)
//   questions: QuestionDto[];
// }

export class QuestionAnswerDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsBoolean()
  is_correct: boolean;
}

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(5) // Adjust the max size as needed
  @IsString({ each: true })
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  answers: QuestionAnswerDto[];

  @IsNotEmpty()
  @IsNumber()
  selected_answer_index: number;
}

export class CreateQuestionsDto {
  @IsArray()
  @ArrayMinSize(1) // Minimum size of the array
  @ArrayMaxSize(10) // Maximum size of the array, adjust as needed
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}