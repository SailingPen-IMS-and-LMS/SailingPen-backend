import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, PrismaClient, } from '@prisma/client';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateSubjectStreamDto } from './dto/create-subject-stream.dto';


@Injectable()
export class SubjectsService {

    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getSubjects() {
        return this.prisma.subject.findMany({
            include: {
                subject_stream: true
            }
        })
    }


    async getSubjectStreams() {
        return this.prisma.subjectStream.findMany({
            include: {
                subjects: true
            }
        })
    }

    async createSubject({ subject_description, subject_name, subject_stream_ids }: CreateSubjectDto) {
        try {
            const subject = await this.prisma.subject.create({
                data: {
                    subject_name,
                    subject_description,
                    subject_stream: {
                        connect: subject_stream_ids.map(id => { return { subject_stream_id: id } }) as Prisma.SubjectStreamWhereUniqueInput[]
                    }
                }
            })
            return subject
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error)
        }
    }

    async createSubjectStream({ subject_stream_description, subject_stream_name }: CreateSubjectStreamDto) {
        try {
            const subjectStream = await this.prisma.subjectStream.create({
                data: {
                    stream_name: subject_stream_name,
                    stream_description: subject_stream_description
                }
            })
            return subjectStream
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error)
        }
    }
}
