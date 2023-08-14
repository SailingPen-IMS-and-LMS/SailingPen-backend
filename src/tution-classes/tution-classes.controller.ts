import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express'
import { TutionClassesService } from "./tution-classes.service"
import { CreateTutionClassDto } from './dto/create-tution-class.dto';
import { EnrollToClassDto } from './dto/enroll-to-class.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('tution-classes')
export class TutionClassesController {

    constructor(private readonly tutionClassesService: TutionClassesService) { }


    @Get("")
    getTutionClasses() {
        return this.tutionClassesService.getTutionClasses()
    }

    @Roles('admin', 'adminassistant')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post("")
    createTutionClass(@Body() createTutionClassDto: CreateTutionClassDto) {
        return this.tutionClassesService.createTutionClass(createTutionClassDto)
    }

    @Roles('student', 'admin', 'adminassistant')
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post("enroll")
    enrollStudentToClass(@Body() enrollToClassDto: EnrollToClassDto) {
        return this.tutionClassesService.enrollStudent(enrollToClassDto)
    }
}
