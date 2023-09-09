import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateSubjectStreamDto } from './dto/create-subject-stream.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) {}

  @Get('')
  getSubjects() {
    return this.subjectService.getSubjects();
  }

  @Get('streams')
  getSubjectStreams() {
    return this.subjectService.getSubjectStreams();
  }

  @Post('')
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Post('streams')
  createSubjectStream(@Body() createSubjectStreamDto: CreateSubjectStreamDto) {
    return this.subjectService.createSubjectStream(createSubjectStreamDto);
  }
}
