import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {CreateLessonPackDto} from "./dto/create-lesson-pack.dto";

@Injectable()
export class LessonPacksService {
    constructor(private prisma: PrismaService) {
    }

    async createLessonPack(userId: string, createLessonPackDto: CreateLessonPackDto) {
        const {name, description, resources, price} = createLessonPackDto

        // check if all resources are his
        for (const resource_id of resources) {
            const foundResource = await this.prisma.resource.findUnique({
                where: {
                    id: resource_id,
                    LibraryFolder: {
                        tutor: {
                            user_id: userId

                        }
                    }
                }
            })
            if (!foundResource) {
                throw new UnprocessableEntityException(`Resource by id ${resource_id} doesn't exist or doesn't belong to the logged in tutor`)
            }
        }

        return this.prisma.lessonPack.create({
            data: {
                name,
                description,
                price,
                tutor: {
                    connect: {
                        user_id: userId
                    }
                }
            }
        })
    }

    async getLessonPacks(userId: string) {
        return this.prisma.lessonPack.findMany({
            where: {
                tutor: {
                    user_id: userId
                }
            }
        })
    }

    async buyLessonPack(userId: string, lessonPackId: string) {

        // check if lessonPackId is valid.
        const lessonPack = await this.prisma.studentBoughtLessonPack.findFirst({
            where: {
                lesson_pack_id: lessonPackId,
                student: {
                    user_id: userId
                }
            }
        })

        if(lessonPack) {
            throw new UnprocessableEntityException(`You're already own this lesson pack`)
        }

        return this.prisma.student.update({
            where: {
                user_id: userId
            },
            data: {
                lessonPacks: {
                    create: {
                        lesson_pack_id: lessonPackId,
                        bought_date: new Date()
                    }
                }
            }
        })

    }

    async getBoughtLessonPacks(userId: string) {
      return this.prisma.lessonPack.findMany({
          where: {
             students: {
                 some: {
                     student: {
                         user_id: userId
                     }
                 }
             }
          }
      })
    }
}
