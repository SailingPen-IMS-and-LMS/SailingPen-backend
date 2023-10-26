import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExampleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
