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
import { ExamplesModule } from './examples/examples.module';
//
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    NestjsFormDataModule.config({ isGlobal: true }),
    SubjectsModule,
    TutionClassesModule,
    QuizzesModule,
    LibraryModule,
    ExamplesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
