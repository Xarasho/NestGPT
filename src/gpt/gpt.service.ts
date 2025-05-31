import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';

import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos';

// Services are a centralized place to maintain information
@Injectable()
export class GptService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // It'll just call the use-cases

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }
}
