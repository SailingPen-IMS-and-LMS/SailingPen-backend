import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTutionClassDto } from './dto/create-tution-class.dto';
import { EnrollToClassDto } from './dto/enroll-to-class.dto';

@Injectable()
export class TutionClassesService {



    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    getTutionClasses() {
        return this.prisma.tutionClass.findMany({
            include: { subject: true, tutor: true, enrollment: true }
        })
    }

    async createTutionClass({ class_name, class_description, subject_id, tutor_id }: CreateTutionClassDto) {
        try {
            const tutionClass = await this.prisma.tutionClass.create({
                data: {
                    class_name,
                    class_description,
                    subject_id,
                    tutor_id
                }
            })
            return tutionClass
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error)
        }
    }

    async enrollStudent({ class_id, student_id }: EnrollToClassDto) {

        const existingEnrollment = await this.prisma.enrollment.findFirst({ where: { class_id, student_id } })
        if (existingEnrollment) {
            throw new UnprocessableEntityException('Student is already enrolled to the class')
        }
        const enrollment = await this.prisma.enrollment.create({ data: { class_id, student_id } })
        return enrollment
    }
}
