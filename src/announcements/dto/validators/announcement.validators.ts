import { Injectable } from '@nestjs/common';
import {
     CreateAnnouncementDto, 
     UpdateAnnouncementDto 
    } from '../create-announcements.dto';


@Injectable()
export class AnnouncementValidator {
  validateCreateAnnouncementDto(createAnnouncementDto: CreateAnnouncementDto): void {
    const { title, content, tution_class_id } = createAnnouncementDto;

    if (!title || !content || !tution_class_id) {
      throw new Error('Title, content, and tution_class_id are required');
    }

    if (typeof title !== 'string' || typeof content !== 'string' || typeof tution_class_id !== 'number') {
      throw new Error('Invalid input data type');
    }
  }

  validateUpdateAnnouncementDto(updateAnnouncementDto: UpdateAnnouncementDto): void {
    const { title, content } = updateAnnouncementDto;

    if (!title && !content) {
      throw new Error('At least one field is required to update');
    }

    if (title && typeof title !== 'string') {
      throw new Error('Invalid title data type');
    }

    if (content && typeof content !== 'string') {
      throw new Error('Invalid content data type');
    }
  }

  validateGetAnnouncementDetails(
    userId: string, 
    announcementId: number): void {
    if (!userId || !announcementId) {
      throw new Error('User ID and announcement ID are required');
    }

    if (typeof userId !== 'string' || typeof announcementId !== 'number') {
      throw new Error('Invalid input data type');
    }
  }

  validateGetAnnouncementsByClassId(
    userId: string, 
    classId: string): void {
    if (!userId || !classId) {
      throw new Error('User ID and class ID are required');
    }

    if (typeof userId !== 'string' || typeof classId !== 'string') {
      throw new Error('Invalid input data type');
    }
  }

  validateGetAnnouncementsByTutorId(userId: string): void {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (typeof userId !== 'string') {
      throw new Error('Invalid input data type');
    }
  }

  validateDeleteAnnouncement(
    userId: string, 
    announcementId: number): void {
    if (!userId || !announcementId) {
      throw new Error('User ID and announcement ID are required');
    }

    if (typeof userId !== 'string' || typeof announcementId !== 'number') {
      throw new Error('Invalid input data type');
    }
  }

  validateGetAnnouncementsByDateRange(
    startDate: Date, 
    endDate: Date): void {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new Error('Invalid input data type');
    }

    if (startDate > endDate) {
      throw new Error('Start date cannot be later than end date');
    }
  }
}