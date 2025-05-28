import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';

// Services are a centralized place to maintain information
@Injectable()
export class GptService {
  // It'll just call the use-cases

  async orthographyCheck() {
    return await orthographyCheckUseCase();
  }
}
