import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto, CreateQuestionsDto } from './dto/create-quiz.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) { }

  async createQuiz(userId: string, quizData: CreateQuizDto) {
    // Check if the tutor ID is valid

    const { description, title, published, tution_class_id } = quizData;
    // Create a new quiz in the database
    const createdQuiz = await this.prisma.quiz.create({
      data: {
        title,
        published,
        description,
        tutor: {
          connect: { user_id: userId },
        },
        tution_class: {
          connect: {
            class_id: tution_class_id
          }
        }
      },
    });

    return createdQuiz;
  }

  async createQuestion(userId: string, quizId: string, questionsData: CreateQuestionsDto) {


    const { questions } = questionsData

    // Check if the quiz exists
    const quiz = await this.prisma.quiz.findUnique({
      where: { quiz_id: quizId, },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }


    for (const question of questions) {
      const createdQuestion = await this.prisma.question.create({
        data: {
          text: question.text,
          quiz_id: quizId,
        }
      })
      await this.prisma.answer.createMany({
        data: question.answers.map(a => {
          return {
            is_correct: a.is_correct,
            text: a.text,
            question_id: createdQuestion.question_id
          } as Prisma.AnswerCreateManyInput
        })
      })
    }

    return true
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
