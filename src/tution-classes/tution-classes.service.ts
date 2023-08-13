import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTutionClassDto } from './dto/create-tution-class.dto';

@Injectable()
export class TutionClassesService {


    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    getTutionClasses() {
        return this.prisma.tutionClass.findMany({
            include: { subject: true, tutor: true }
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
}
