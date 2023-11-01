import { Body, Controller, Get, Post, Put, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuestionDto } from './dto/create-quiz.dto';
import { CreateQuestionsDto } from './dto/create-quiz.dto';
import { AuthenticatedUser } from 'src/auth/types/jwt.types';



@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Roles('tutor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:quizId')
  getQuiz(@Param('quizId') quizId: string) {
    return this.quizzesService.getQuiz(quizId);
  }

 @Roles('tutor')
 @UseGuards(JwtAuthGuard, RolesGuard)
 @Post('')
  createQuiz( @Req() req:Request,@Body() quizData: CreateQuizDto) {


    const user= req.user as AuthenticatedUser;
    const userId=user.sub;
    return this.quizzesService.createQuiz(userId,quizData);
  }


@Roles('tutor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Post('/:quizId/questions')
createQuestion(
  @Req() req: Request,
  @Param('quizId') quizId: string,
  @Body() questionsData: CreateQuestionsDto,
) {
  const user = req.user as AuthenticatedUser;
  const userId = user.sub;
  return this.quizzesService.createQuestion(userId, quizId, questionsData);
}

  @Put('/:quizId/publish')
  publishQuiz(@Param('quizId') quizId: string) {
    return this.quizzesService.publishQuiz(quizId);
  }
  /////////////////////////////////////////////


@Roles('tutor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete('/:quizId')
deleteQuiz(@Param('quizId') quizId: string) {
  return this.quizzesService.deleteQuiz(quizId);
}

@Roles('tutor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Put('/:quizId')
updateQuiz(@Param('quizId') quizId: string, @Body() quizData: CreateQuizDto) {
  return this.quizzesService.updateQuiz(quizId, quizData);
}

@Roles('tutor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete('/questions/:questionId')
deleteQuestion(@Param('questionId') questionId: string) {
  return this.quizzesService.deleteQuestion(questionId);
}

@Roles('tutor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Put('/questions/:questionId')
updateQuestion(
  @Param('questionId') questionId: string,
  @Body() questionData: QuestionDto,
) {
  return this.quizzesService.updateQuestion(questionId, questionData);
}
}





