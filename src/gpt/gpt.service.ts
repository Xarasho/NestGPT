import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import OrthographyDto from './dtos';

// Services are a centralized place to maintain information
@Injectable()
export class GptService {
  // It'll just call the use-cases

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase({
      prompt: orthographyDto.prompt,
    });
  }
}
