import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto, CreateQuestionDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuiz(userId: string, quizData: CreateQuizDto) {
    // Check if the tutor ID is valid

    const { description, title, published } = quizData;
    // Create a new quiz in the database
    const createdQuiz = await this.prisma.quiz.create({
      data: {
        title,
        published,
        description,
        tutor: { connect: { user_id: userId } },
      },
    });

    return createdQuiz;
  }

  async createQuestion(quizId: string, questionData: CreateQuestionDto) {
    // Check if the quiz exists
    const quiz = await this.prisma.quiz.findUnique({
      where: { quiz_id: quizId },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Create a new question associated with the quiz
    const createdQuestion = await this.prisma.question.create({
      data: {
        ...questionData,
        quiz: { connect: { quiz_id: quizId } },
      },
    });
    return createdQuestion;
  }

  async publishQuiz(quizId: string) {
    // Update the quiz to mark it as published
    const publishedQuiz = await this.prisma.quiz.update({
      where: { quiz_id: quizId },
      data: { published: true },
    });
    return publishedQuiz;
  }

  async getQuiz(quizId: string) {
    // Retrieve quiz details, including its questions and answers
    const quiz = await this.prisma.quiz.findUnique({
      where: { quiz_id: quizId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }
}
