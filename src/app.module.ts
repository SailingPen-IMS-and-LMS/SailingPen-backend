import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Importing modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TutionClassesModule } from './tution-classes/tution-classes.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { LibraryModule } from './library/library.module';
import { FlashcardModule } from './flashcards/flashcards.module';

@Module({
  imports: [
    //these are like paths
    ConfigModule.forRoot({ isGlobal: true }), //env file
    AuthModule,
    UsersModule,
    NestjsFormDataModule.config({ isGlobal: true }),
    SubjectsModule,
    TutionClassesModule,
    QuizzesModule,
    LibraryModule,
    FlashcardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
