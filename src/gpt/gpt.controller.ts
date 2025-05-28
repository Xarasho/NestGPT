import { Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';

// Controllers listen to requests and return responses
@Controller('gpt')
export class GptController {
  // Dependency injection
  // We're injecting the gptService method inside this controller
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck() {
    return this.gptService.orthographyCheck();
  }
}
