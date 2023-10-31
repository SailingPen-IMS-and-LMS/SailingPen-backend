import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  Param,
} from '@nestjs/common';

import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/create-subject.dto';
import { CreateSubjectStreamDto } from './dto/create-subject-stream.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Update } from 'aws-sdk/clients/dynamodb';

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

  //admin create subjects
  @Post('')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('streams')
  createSubjectStream(
    @Body() createSubjectStreamDto: CreateSubjectStreamDto) 
  {
    return this.subjectService.createSubjectStream(createSubjectStreamDto);
  }

  @Patch('update-subject/:subject_id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  updateSubject(
    @Body() updateContent: UpdateSubjectDto,
    @Param('subject_id') subject_id: string,
  ) {
    return this.subjectService.updateSubject(updateContent, subject_id);
  }

}
