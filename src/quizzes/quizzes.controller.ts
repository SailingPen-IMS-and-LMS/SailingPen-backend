import { Controller, Get ,Body, Post} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}




    @Get("/")
    getAllQuiz() {
        return this.quizzesService.getAllQuiz()
    }
    @Post("/create")
    createQuiz(@Body() quizData: any) {
        return {data: quizData};
    }

 
}
