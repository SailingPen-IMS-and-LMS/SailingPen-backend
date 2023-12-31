import {Module} from '@nestjs/common';
import {TutionClassesController} from './controllers/tution-classes.controller';
import {UsersModule} from 'src/users/users.module';
import {TutionClassesService} from './services/tution-classes.service';
import {WeeklySessionsService} from "./services/weekly-sessions.service";
import {WeeklySessionsController} from "./controllers/weekly-sessions.controller";
import { UtilsModule } from 'src/utils/utils.module';

@Module({
    imports: [UsersModule, UtilsModule],
    providers: [TutionClassesService, WeeklySessionsService],
    controllers: [TutionClassesController, WeeklySessionsController],
})
export class TutionClassesModule {
}
