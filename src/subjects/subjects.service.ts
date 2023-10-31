import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma, Subject } from '@prisma/client';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/create-subject.dto';
import { CreateSubjectStreamDto } from './dto/create-subject-stream.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}


  async getSubjects() {
    return this.prisma.subject.findMany({
      include: {
        subject_stream: true,
      },
    });
  }


  async getSubjectStreams() {
    return this.prisma.subjectStream.findMany({
      include: {
        subjects: true,
      },
    });
  }


  async createSubject({
    subject_description,
    subject_name,
    subject_stream_ids,
  }: CreateSubjectDto) {
    try {
      const subject = await this.prisma.subject.create({
        data: {
          subject_name,
          subject_description,
          subject_stream: {
            connect: subject_stream_ids.map((id) => {
              return { subject_stream_id: id };
            }) as Prisma.SubjectStreamWhereUniqueInput[],
          },
        },
      });
      return subject;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }


  async createSubjectStream({
    subject_stream_description,
    subject_stream_name,
  }: CreateSubjectStreamDto) {
    try {
      const subjectStream = await this.prisma.subjectStream.create({
        data: {
          stream_name: subject_stream_name,
          stream_description: subject_stream_description,
        },
      });
      return subjectStream;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  
  //update subject
  async updateSubject(updateSubjectDto: UpdateSubjectDto, subjectId: string): Promise<Subject> {
    const { subject_name, subject_description, subject_stream_ids } = updateSubjectDto;

    const subject = await this.prisma.subject.findUnique({
      where: { subject_id: subjectId },
      include: { subject_stream: true },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    const updatedSubject = await this.prisma.subject.update({
      where: { subject_id: subjectId },
      data: {
        subject_name: subject_name ?? subject.subject_name,
        subject_description: subject_description ?? subject.subject_description,
        subject_stream: subject_stream_ids
          ? {
              connect: subject_stream_ids.map((id) => (
                { subject_stream_id: id }
                )
              ),
            }
          : undefined,
      },
      include: { subject_stream: true },
    });

    return updatedSubject;
  }
}
