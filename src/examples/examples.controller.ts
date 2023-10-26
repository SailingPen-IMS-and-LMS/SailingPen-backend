import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExamplesService } from './examples.service';
import { CreateExampleDto } from './dto/create-example.dto';

@Controller('examples')
export class ExamplesController {
  constructor(private readonly examplesService: ExamplesService) {}

  @Get()
  getAllExamples() {
    return this.examplesService.getExamples();
  }

  @Post()
  createExample(@Body() createExampleDto: CreateExampleDto) {
    return this.examplesService.createExample(createExampleDto);
  }
}
