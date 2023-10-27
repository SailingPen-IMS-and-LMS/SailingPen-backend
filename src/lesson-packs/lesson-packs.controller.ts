import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import type {Request} from 'express'
import {LessonPacksService} from "./lesson-packs.service";
import {CreateLessonPackDto} from "./dto/create-lesson-pack.dto";
import {Roles} from "../auth/decorators/roles.decorator";
import {JwtAuthGuard} from "../common/guards/jwt-auth.guard";
import {RolesGuard} from "../common/guards/roles.guard";
import {AuthenticatedUser} from "../auth/types/jwt.types";

@Controller('lesson-packs')
export class LessonPacksController {
    constructor(private  readonly lessonPacksService: LessonPacksService) {
    }


    @HttpCode(HttpStatus.OK)
    @Roles('tutor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('')
    getLessonPacks(
        @Req() req: Request,
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.lessonPacksService.getLessonPacks(userId)
    }

    @HttpCode(HttpStatus.CREATED)
    @Roles('tutor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('')
    createLessonPack(
        @Req() req: Request,
        @Body() createLessonPackDto: CreateLessonPackDto
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.lessonPacksService.createLessonPack(userId, createLessonPackDto)
    }


    @HttpCode(HttpStatus.OK)
    @Roles('student')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('/buy')
    buyLessonPack(
        @Req() req: Request,
        @Query('lesson_pack_id') lesson_pack_id: string
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.lessonPacksService.buyLessonPack(userId,lesson_pack_id)
    }


    @HttpCode(HttpStatus.OK)
    @Roles('student')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/bought')
    fetchBoughtLessonPacks(
        @Req() req: Request,
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.lessonPacksService.getBoughtLessonPacks(userId)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('student')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/available-to-buy')
    fetchAvailableForBuyingLessonPacks(
        @Req() req: Request,
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.lessonPacksService.getAvailableToByLessonPacks(userId)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('student')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/available-to-buy/:lesson_pack_id')
    getMoreDetailsOfStoreLessonPack(
        @Param('lesson_pack_id') lesson_pack_id: string
    ) {
        return this.lessonPacksService.getMoreDetailsOfLessonPack(lesson_pack_id)
    }


    @HttpCode(HttpStatus.OK)
    @Roles('student')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/available-to-buy/:lesson_pack_id/resources')
    getResourcesOfLessonPacks(
        @Req() req:Request,
        @Param('lesson_pack_id') lesson_pack_id: string
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.lessonPacksService.getResourcesOfLessonPackByStudent(userId, lesson_pack_id)
    }
}
