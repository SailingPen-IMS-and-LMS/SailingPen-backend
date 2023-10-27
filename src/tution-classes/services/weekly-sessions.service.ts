import {
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {CreateWeeklySessionDto} from "../dto/create-weekly-session.dto";

@Injectable()
export class WeeklySessionsService {
    constructor(private readonly prisma: PrismaService) {}

    async createWeeklySession(userId: string, tution_class_id: string, createWeeklySessionDto: CreateWeeklySessionDto) {
        const tutionClass = await this.prisma.tutionClass.findUnique({
            where: {
                class_id: tution_class_id,
                tutor: {
                    user_id: userId
                }
            }
        })

        if(!tutionClass) {
            throw new ForbiddenException(`You're not permitted to access this class`)
        }

        const {date, attachments, description, video} = createWeeklySessionDto
        const {schedule} = tutionClass

        console.log(schedule)
        return "Hello"

    }
}
