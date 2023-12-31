import { ForbiddenException, Injectable, UnprocessableEntityException, } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { DateUtils } from "../../utils/DateUtils"
import { CreateWeeklySessionDto } from "../dto/create-weekly-session.dto";
import { DayName } from 'src/types/util-types';
import { ConfigService } from '@nestjs/config';
import { ResourceType } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class WeeklySessionsService {


    constructor(private readonly prisma: PrismaService, private readonly dateUtils: DateUtils, private readonly configService: ConfigService) { }

    async createWeeklySession(userId: string, tution_class_id: string, createWeeklySessionDto: CreateWeeklySessionDto) {
        console.log(`CLass id is ${tution_class_id}`)
        const tutionClass = await this.prisma.tutionClass.findUnique({
            where: {
                class_id: tution_class_id,
                tutor: {
                    user_id: userId
                }
            }
        })

        if (!tutionClass) {
            throw new ForbiddenException(`You're not permitted to access this class`)
        }

        const { date, attachment_ids, description, video_resource_id, } = createWeeklySessionDto

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

        if (!videoResource) {
            throw new ForbiddenException('This resource is not owned by the logged in user')
        }

        const preparedDate = new Date(date)
        const { schedule } = tutionClass
        if (!schedule) {
            throw new UnprocessableEntityException(`Schedule not found for the class`)
        }

        const day = (schedule as Record<string, unknown>).day as DayName;
        const dates = this.dateUtils.getDaysInCurrentMonth(preparedDate, day)
        if (!dates.includes(date)) {
            throw new UnprocessableEntityException(`Date ${date} is not in the schedule of the class`)
        }

        const createdWeeklySession = await this.prisma.weeklySession.create({
            data: {
                date: preparedDate,
                description: description,
                video_url: videoResource.url,
                video_thumbnail_url: videoResource.thumbnail_url || '',
                tution_class_id: tution_class_id,
                attachments: {
                    connect: attachment_ids.map(id => ({ id }))
                }
            }
        })

        console.log(createWeeklySessionDto)
        return createWeeklySessionDto

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

        if (!tutionClass) {
            throw new UnprocessableEntityException(`Tution class invalid or you don't have access`)
        }

        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1)
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
        const weeklySessions = await this.prisma.weeklySession.findMany({
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

        const cloudflareAccountId = this.configService.get<string>(
            'CLOUDFLARE_ACCOUNT_ID',
        );
        const cloudflareSecretKey = this.configService.get<string>(
            'CLOUDFLARE_SECRET_KEY',
        );

        for (const ws of weeklySessions) {
            const videoResource = await this.prisma.resource.findFirst({
                where: {
                    type: ResourceType.video,
                    url: ws.video_url
                }
            })

            if (videoResource) {

                const signedTokenResult = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/${videoResource.video_id}/token`, {}, {
                    headers: {
                        'Authorization': `Bearer ${cloudflareSecretKey}`,
                    }
                })
                console.log(signedTokenResult.data)
                const signedToken = signedTokenResult.data.result.token as string;
                ws.video_url = ws.video_url.replace(videoResource.video_id || '', signedToken)

            }

        }

        return weeklySessions
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

        if (!tutionClass) {
            throw new UnprocessableEntityException(`Tution class invalid or you don't have access`)
        }

        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1)
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
        const weeklySessions = await  this.prisma.weeklySession.findMany({
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

        const cloudflareAccountId = this.configService.get<string>(
            'CLOUDFLARE_ACCOUNT_ID',
        );
        const cloudflareSecretKey = this.configService.get<string>(
            'CLOUDFLARE_SECRET_KEY',
        );

        for (const ws of weeklySessions) {
            const videoResource = await this.prisma.resource.findFirst({
                where: {
                    type: ResourceType.video,
                    url: ws.video_url
                }
            })

            if (videoResource) {

                const signedTokenResult = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/${videoResource.video_id}/token`, {}, {
                    headers: {
                        'Authorization': `Bearer ${cloudflareSecretKey}`,
                    }
                })
                console.log(signedTokenResult.data)
                const signedToken = signedTokenResult.data.result.token as string;
                ws.video_url = ws.video_url.replace(videoResource.video_id || '', signedToken)

            }

        }

        return weeklySessions
    }

    getWeeklyVideoDetailsByResourceId(userId: string, resourceId: number) {
        const resource = this.prisma.resource.findUnique({
            where: {
                id: resourceId,
                LibraryFolder: {
                    tutor: {
                        user_id: userId
                    }
                }
            },

        })
        if (!resource) {
            throw new UnprocessableEntityException(`Resource not found`)
        }
        return resource
    }

    getAttachmentsDetailsByResourceIds(userId: string, resourceIds: number[]) {
        const resources = this.prisma.resource.findMany({
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

        if (!resources) {
            throw new UnprocessableEntityException(`Resource not found`)
        }

        return resources
    }
}
