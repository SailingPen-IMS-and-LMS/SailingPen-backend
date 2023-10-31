import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto, CreateQuestionsDto, QuestionDto, QuestionAnswerDto } from './dto/create-quiz.dto';
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

  // async createQuestion(userId: string, quizId: string, questionsData: CreateQuestionsDto) {


  //   const { questions } = questionsData

  //   // Check if the quiz exists
  //   const quiz = await this.prisma.quiz.findUnique({
  //     where: { quiz_id: quizId, },
  //   });
  //   if (!quiz) {
  //     throw new NotFoundException('Quiz not found');
  //   }


  //   for (const question of questions) {
  //     const createdQuestion = await this.prisma.question.create({
  //       data: {
  //         text: question.text,
  //         quiz_id: quizId,
  //       }
  //     })
  //     await this.prisma.answer.createMany({
  //       data: question.answers.map(a => {
  //         return {
  //           is_correct: a.is_correct,
  //           text: a.text,
  //           question_id: createdQuestion.question_id
  //         } as Prisma.AnswerCreateManyInput
  //       })
  //     })
  //   }

  //   return true
  // }

  // async createQuestion(userId: string, quizId: string, questionsData: CreateQuestionsDto) {
  //   const { questions } = questionsData;
  
  //   // Check if the quiz exists
  //   const quiz = await this.prisma.quiz.findUnique({
  //     where: { quiz_id: quizId },
  //   });
  //   if (!quiz) {
  //     throw new NotFoundException('Quiz not found');
  //   }
  
  //   for (const question of questions) {
  //     const createdQuestion = await this.prisma.question.create({
  //       data: {
  //         text: question.text,
  //         quiz_id: quizId,
  //       },
  //     });
  
  //     const correctAnswer = question.answers[question.selected_answer_index];
  
  //     await this.prisma.answer.createMany({
  //       data: question.answers.map((a) => {
  //         return {
  //           is_correct: a === correctAnswer,
  //           text: a.text,
  //           question_id: createdQuestion.question_id,
  //         } as Prisma.AnswerCreateManyInput;
  //       }),
  //     });
  //   }
  
  //   return true;
  // }

  async createQuestion(userId: string, quizId: string, questionsData: CreateQuestionsDto) {
    const { questions } = questionsData;
  
    // Check if the quiz exists
    const quiz = await this.prisma.quiz.findUnique({
      where: { quiz_id: quizId },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    for (const question of questions) {
      const createdQuestion = await this.prisma.question.create({
        data: {
          text: question.text,
          quiz_id: quizId,
        },
      });
  
      const correctAnswer = question.answers[question.selected_answer_index];
  
      await this.prisma.answer.createMany({
        data: question.answers.map((a: QuestionAnswerDto) => {
          return {
            is_correct: a === correctAnswer,
            text: a.text,
            question_id: createdQuestion.question_id,
          } as Prisma.AnswerCreateManyInput;
        }),
      });
    }
  
    return true;
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

  
  ///////////////////////////////////////////////////////

  
  async deleteQuiz(quizId: string) {
    // Delete the quiz and its associated questions and answers
    await this.prisma.answer.deleteMany({
      where: { question: { quiz_id: quizId } },
    });
    await this.prisma.question.deleteMany({
      where: { quiz_id: quizId },
    });
    const deletedQuiz = await this.prisma.quiz.delete({
      where: { quiz_id: quizId },
    });
    return deletedQuiz;
  }
  
  async updateQuiz(quizId: string, quizData: CreateQuizDto) {
    // Update the quiz with the new data
    const { description, title, published, tution_class_id } = quizData;
    const updatedQuiz = await this.prisma.quiz.update({
      where: { quiz_id: quizId },
      data: {
        title,
        published,
        description,
        tution_class: {
          connect: {
            class_id: tution_class_id,
          },
        },
      },
    });
    return updatedQuiz;
  }
  
  async deleteQuestion(questionId: string) {
    // Delete the question and its associated answers
    await this.prisma.answer.deleteMany({
      where: { question_id: questionId },
    });
    const deletedQuestion = await this.prisma.question.delete({
      where: { question_id: questionId },
    });
    return deletedQuestion;
  }
  
  // async updateQuestion(questionId: string, questionData: QuestionDto) {
  //   // Update the question with the new data
  //   const { text, answers } = questionData;
  //   const updatedQuestion = await this.prisma.question.update({
  //     where: { question_id: questionId },
  //     data: {
  //       text,
  //       answers: {
  //         deleteMany: {},
  //         createMany: answers.map((a) => {
  //           return {
  //             is_correct: a.is_correct,
  //             text: a.text,
  //           } as Prisma.AnswerCreateManyInput;
  //         }),
  //       },
  //     },
  //   });
  //   return updatedQuestion;
  // }
  // async updateQuestion(questionId: string, questionData: QuestionDto) {
  //   // Update the question with the new data
  //   const { text, answers } = questionData;
  //   const updatedQuestion = await this.prisma.question.update({
  //     where: { question_id: questionId },
  //     data: {
  //       text,
  //       answers: {
  //         deleteMany: {},
  //         createMany: answers.map((a: QuestionAnswerDto) => {
  //           return {
  //             is_correct: a.is_correct,
  //             text: a.text,
  //           } as Prisma.AnswerCreateManyInput;
  //         }),
  //       },
  //     },
  //   });
  //   return updatedQuestion;
  // }

  async updateQuestion(questionId: string, questionData: QuestionDto) {
    // Update the question with the new data
    const { text, answers } = questionData;
    const updatedQuestion = await this.prisma.question.update({
      where: { question_id: questionId },
      data: {
        text,
        answers: {
          deleteMany: {},
          createMany: {
            data: answers.map((a: QuestionAnswerDto) => {
              return {
                is_correct: a.is_correct,
                text: a.text,
              } as Prisma.AnswerCreateManyInput;
            }),
          },
        },
      },
    });
    return updatedQuestion;
  }
}


