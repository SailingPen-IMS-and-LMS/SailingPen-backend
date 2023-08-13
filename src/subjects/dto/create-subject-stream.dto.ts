import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {  IsSubjectStreamNameUnique} from '../validators';


export class CreateSubjectStreamDto {

  @ApiProperty()
  @IsSubjectStreamNameUnique()
  @IsNotEmpty()
  @IsString()
  subject_stream_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject_stream_description: string;

}
