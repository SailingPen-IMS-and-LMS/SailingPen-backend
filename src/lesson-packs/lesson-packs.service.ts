import {Injectable, NotFoundException, UnprocessableEntityException} from '@nestjs/common';
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

        if (lessonPack) {
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
                studentBoughtLessonPacks: {
                    some: {
                        student: {
                            user_id: userId
                        },
                    }
                }
            },
            include: {
                tutor: {
                    select: {
                        user: {
                            select: {
                                f_name: true,
                                l_name: true
                            }
                        }
                    }
                },
            }
        })
    }

    async getAvailableToByLessonPacks(userId: string) {
        // logged in student's tutors' lesson packs that are not yet bought by this student
        return this.prisma.lessonPack.findMany({
            where: {
                studentBoughtLessonPacks: {
                    none: {
                        student: {
                            user_id: userId
                        }
                    }
                },
                tutor: {
                    tutionclasses: {
                        some: {
                            enrollment: {
                                some: {
                                    student: {
                                        user_id: userId
                                    }
                                }
                            }
                        }
                    }
                }
            },
            include: {
                tutor: {
                    select: {
                        user: {
                            select: {
                                f_name: true,
                                l_name: true
                            }
                        }
                    }
                }
            }
        });
    }

    async getMoreDetailsOfLessonPack(lesson_pack_id: string) {
        const lessonPackDetails = await this.prisma.lessonPack.findUnique({
            where: {
                id: lesson_pack_id
            },
            include: {
                tutor: {
                    select: {
                        user: {
                            select: {
                                f_name: true,
                                l_name: true
                            }
                        }
                    }
                },
                resources: {
                    select: {
                        name: true,
                        id: true,
                        thumbnail_url: true,
                        type: true
                    }
                }
            }
        })

        if (!lessonPackDetails) {
            throw new NotFoundException('Lesson pack id is invalid')
        }
        return lessonPackDetails
    }

    async getResourcesOfLessonPackByStudent(userId: string, lesson_pack_id: string) {
        const lessonPack = await this.prisma.lessonPack.findUnique({
            where: {
                id: lesson_pack_id,
                studentBoughtLessonPacks: {
                    some: {
                        student: {
                            user_id: userId
                        }
                    }
                }
            },
            include: {
                resources: true
            }
        })

        if (!lessonPack) {
            throw new UnprocessableEntityException("Lesson pack id is not valid or you don't have access")
        }

        return lessonPack.resources
    }
}
