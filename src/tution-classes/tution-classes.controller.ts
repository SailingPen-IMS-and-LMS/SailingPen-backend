import { Body, Controller, Post, Get } from '@nestjs/common';
import {TutionClassesService} from "./tution-classes.service"
import { CreateTutionClassDto } from './dto/create-tution-class.dto';
import { EnrollToClassDto } from './dto/enroll-to-class.dto';

@Controller('tution-classes')
export class TutionClassesController {

    constructor(private readonly tutionClassesService: TutionClassesService) {}


    @Get("")
    getTutionClasses() {
        return this.tutionClassesService.getTutionClasses()
    }

    @Post("")
    createTutionClass(@Body() createTutionClassDto: CreateTutionClassDto) {
        return this.tutionClassesService.createTutionClass(createTutionClassDto)
    }

    @Post("enroll")
    enrollStudentToClass(@Body() enrollToClassDto: EnrollToClassDto) {
        return this.tutionClassesService.enrollStudent(enrollToClassDto)
    }
}
