import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizzesService {

    getAllQuiz() {
        return "Hello from QuizzesService"
    }

}
