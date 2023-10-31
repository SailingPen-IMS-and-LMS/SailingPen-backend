import { Injectable } from '@nestjs/common';
import { CreateSubjectDto, UpdateSubjectDto } from '../dto/create-subject.dto';
import { CreateSubjectStreamDto, UpdateSubjectStreamDto } from '../dto/create-subject-stream.dto';

@Injectable()
class SubjectValidator {
  validateCreateSubjectDto(
    createSubjectDto: CreateSubjectDto
    ): void {
    const { subject_name, subject_description, subject_stream_ids } = createSubjectDto;

    if (!subject_name 
        || !subject_description 
        || !subject_stream_ids) {
      throw new Error('Subject name, description, and stream IDs are required');
    }

    if (typeof subject_name !== 'string' 
    || typeof subject_description !== 'string' 
    || !Array.isArray(subject_stream_ids)) {
      throw new Error('Invalid input data type');
    }

    if (subject_stream_ids.some((id) => typeof id !== 'string')) {
      throw new Error('Invalid subject stream ID data type');
    }
  }

  validateCreateSubjectStreamDto(
    createSubjectStreamDto: CreateSubjectStreamDto
    ): void {
    const { subject_stream_name, subject_stream_description } = createSubjectStreamDto;

    if (!subject_stream_name 
        || !subject_stream_description) {
      throw new Error('Subject stream name and description are required');
    }

    if (typeof subject_stream_name !== 'string' || typeof subject_stream_description !== 'string') {
      throw new Error('Invalid input data type');
    }
  }

  validateUpdateSubjectDto(
    updateSubjectDto: UpdateSubjectDto
    ): void {
    const { subject_name, subject_description, subject_stream_ids } = updateSubjectDto;

    if (!subject_name && 
        !subject_description && 
        !subject_stream_ids) {
      throw new Error('At least one field is required to update');
    }

    if (subject_name && 
        typeof subject_name !== 'string') {
      throw new Error('Invalid subject name data type');
    }

    if (subject_description && 
        typeof subject_description !== 'string') {
      throw new Error('Invalid subject description data type');
    }

    if (subject_stream_ids && 
        !Array.isArray(subject_stream_ids)) {
      throw new Error('Invalid subject stream ID data type');
    }

    if (subject_stream_ids && 
        subject_stream_ids.some((id) => typeof id !== 'string')) {
      throw new Error('Invalid subject stream ID data type');
    }
  }

  validateUpdateSubjectStreamDto(
    updateSubjectStreamDto: UpdateSubjectStreamDto
    ): void {
    const { subject_stream_name, subject_stream_description } = updateSubjectStreamDto;

    if (!subject_stream_name && 
        !subject_stream_description) {
      throw new Error('At least one field is required to update');
    }

    if (subject_stream_name && 
        typeof subject_stream_name !== 'string') {
      throw new Error('Invalid subject stream name data type');
    }

    if (subject_stream_description && 
        typeof subject_stream_description !== 'string') {
      throw new Error('Invalid subject stream description data type');
    }
  }
}