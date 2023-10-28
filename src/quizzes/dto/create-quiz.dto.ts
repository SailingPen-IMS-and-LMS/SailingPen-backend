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

  @IsString()
  tutor: string; // or whatever type represents a tutor
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

