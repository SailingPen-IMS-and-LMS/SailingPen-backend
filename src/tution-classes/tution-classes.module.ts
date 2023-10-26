import { Module } from '@nestjs/common';
import { TutionClassesService } from './services/tution-classes.service';
import { TutionClassesController } from './controllers/tution-classes.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TutionClassesService],
  controllers: [TutionClassesController],
})
export class TutionClassesModule {}
