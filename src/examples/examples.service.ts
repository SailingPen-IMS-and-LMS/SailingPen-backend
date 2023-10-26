import { Injectable, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateExampleDto } from './dto/create-example.dto';

@Injectable()
export class ExamplesService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getExamples() {
    return this.prisma.example.findMany();
  }

  createExample(exampleData: CreateExampleDto) {
    const { name, description } = exampleData;
    return this.prisma.example.create({
      data: {
        name,
        description,
      },
    });
  }
}
