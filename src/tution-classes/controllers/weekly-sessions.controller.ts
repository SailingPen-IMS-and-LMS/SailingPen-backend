import { UsersService } from 'src/users/services/users.service';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TutionClassesService } from '../services/tution-classes.service';
import { CreateTutionClassDto } from '../dto/create-tution-class.dto';
import { EnrollToClassDto } from '../dto/enroll-to-class.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';
import { WeeklySessionsService } from "../services/weekly-sessions.service";
import { CreateWeeklySessionDto } from "../dto/create-weekly-session.dto";

@Controller('tution-classes/weekly-sessions')
export class WeeklySessionsController {
    constructor(
        private readonly weeklySessionsService: WeeklySessionsService,
        private readonly usersService: UsersService,
    ) { }


    @HttpCode(HttpStatus.CREATED)
    @Roles('tutor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('')
    async createWeeklySession(
        @Req() req: Request,
        @Query('tution_class_id') tution_class_id: string,
        @Body() createWeeklySessionDto: CreateWeeklySessionDto
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.weeklySessionsService.createWeeklySession(userId, tution_class_id, createWeeklySessionDto)
    }

    @Roles('tutor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('')
    async getCurrentMonthWeeklySessions(
        @Req() req: Request,
        @Query('tution_class_id') tution_class_id: string,
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.weeklySessionsService.getWeeklySessionsForCurrentMonth(userId, tution_class_id)
    }

    @Roles('student')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/for-student')
    async getCurrentMonthWeeklySessionsForStudent(
        @Req() req: Request,
        @Query('tution_class_id') tution_class_id: string,
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.weeklySessionsService.getWeeklySessionsForCurrentMonthForStudent(userId, tution_class_id)
    }



    @HttpCode(200)
    @Roles('tutor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/resources/:resource_id')
    async getVideoDetailsByResourceId(
        @Req() req: Request,
        @Param('resource_id') resource_id: string,
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        return this.weeklySessionsService.getWeeklyVideoDetailsByResourceId(userId, +resource_id)
    }


    @HttpCode(200)
    @Roles('tutor')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/resources/attachments/:resource_ids')
    async getAttachmentsDetailsByResourceIds(
        @Req() req: Request,
        @Param('resource_ids') resource_ids: string,
    ) {
        const user = req.user as AuthenticatedUser
        const userId = user.sub
        const resourceIds = resource_ids.trim().split(',').map(id => +id)
        if (resourceIds.length === 0 && resourceIds[0] === 0) {
            return []
        }
        return this.weeklySessionsService.getAttachmentsDetailsByResourceIds(userId, resourceIds)
    }

}
