import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  published: boolean;


}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsBoolean()
  is_correct: boolean;
}

