import {ForbiddenException, Injectable, UnprocessableEntityException,} from '@nestjs/common';
import {PrismaService} from '../../prisma.service';
import { DateUtils } from "../../utils/DateUtils"
import {CreateWeeklySessionDto} from "../dto/create-weekly-session.dto";
import { DayName } from 'src/types/util-types';

@Injectable()
export class WeeklySessionsService {


    constructor(private readonly prisma: PrismaService, private readonly dateUtils: DateUtils) {}

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

        const {date, attachment_ids, description, video_resource_id, } = createWeeklySessionDto

        const videoResource = await this.prisma.resource.findUnique({
            where: {
                id: video_resource_id,
                LibraryFolder: {
                    tutor: {
                        user_id: userId
                    }
                }
            }
        })

        if(!videoResource) {
            throw new ForbiddenException('This resource is not owned by the logged in user')
        }

        const preparedDate = new Date(date)
        const {schedule} = tutionClass
        if(schedule) {
            const day = (schedule as Record<string, unknown>).day as DayName;
            const dates = this.dateUtils.getDaysInCurrentMonth(preparedDate, day)

            console.log(dates)        
        }

        console.log(schedule)
        return "Hello"

    }

    async getWeeklySessionsForCurrentMonth(userId: string, tution_class_id: string) {
        const tutionClass = await this.prisma.tutionClass.findUnique({
            where: {
                class_id: tution_class_id,
                tutor: {
                    user_id: userId
                },
            }
        })

        if(!tutionClass) {
            throw new UnprocessableEntityException(`Tution class invalid or you don't have access`)
        }

        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1)
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
        return this.prisma.weeklySession.findMany({
            where: {
                tution_class_id: tution_class_id,
                date: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            }
            ,
            // include: {
            //     attachments: true,
            // },
            select: {
                id: true,
                date: true,
                attachments: {
                    select: {
                        id: true,
                        type: true,
                        name: true,
                        url: true,
                        thumbnail_url: true,
                    }
                },
                video_url: true,
                description: true,
                video_thumbnail_url: true
            }
        });
    }

    async getWeeklySessionsForCurrentMonthForStudent(userId: string, tution_class_id: string) {
        const tutionClass = await this.prisma.tutionClass.findUnique({
            where: {
                class_id: tution_class_id,
                enrollment: {
                    some: {
                        student: {
                            user_id: userId
                        }
                    }
                }
            }
        })

        if(!tutionClass) {
            throw new UnprocessableEntityException(`Tution class invalid or you don't have access`)
        }

        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1)
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
        return this.prisma.weeklySession.findMany({
            where: {
                tution_class_id: tution_class_id,
                date: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            }
            ,
            // include: {
            //     attachments: true,
            // },
            select: {
                id: true,
                date: true,
                attachments: {
                    select: {
                        id: true,
                        type: true,
                        name: true,
                        url: true,
                        thumbnail_url: true,
                    }
                },
                video_url: true,
                description: true,
                video_thumbnail_url: true,
                tution_class: {
                    select: {
                        schedule: true
                    }
                }
            }
        });
    }

    getWeeklyVideoDetailsByResourceId(userId: string, resourceId: number) {
        const resource =  this.prisma.resource.findUnique({
            where: {
                id: resourceId,
                LibraryFolder: {
                    tutor: {
                        user_id: userId
                    }
                }
            },
            
        })
        if(!resource) {
            throw new UnprocessableEntityException(`Resource not found`)
        }
        return resource
    }

    getAttachmentsDetailsByResourceIds(userId: string, resourceIds: number[]) {
        const resources =  this.prisma.resource.findMany({
            where: {
                id: {
                    in: resourceIds
                },
                LibraryFolder: {
                    tutor: {
                        user_id: userId
                    }
                }
            },
            
        })

        if(!resources) {
            throw new UnprocessableEntityException(`Resource not found`)
        }

        return resources
    }
}
