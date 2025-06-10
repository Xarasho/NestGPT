import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';
import { FileValidator } from '@nestjs/common';
// import { BadRequestException } from '@nestjs/common';

import OpenAI from 'openai';

import {
  audioToTextUseCase,
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TranslateDto,
  TextToAudioDto,
  AudioToTextDto,
} from './dtos';

interface ExtensionValidatorOptions {
  allowedExtensions: string[];
}

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

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, { prompt });
  }

  async translateText({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  // async textToAudioGetter(fileId: string) {
  //   const filePath = path.resolve(
  //     __dirname,
  //     '../../generated/audios/',
  //     `${fileId}.mp3`,
  //   );
  //   const wasFound = fs.existsSync(filePath);

  //   if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

  //   return filePath;
  // }
  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
    } catch {
      throw new NotFoundException(`File ${fileId} not found`);
    }
    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = audioToTextDto;

    return await audioToTextUseCase(this.openai, { audioFile, prompt });
  }
}

@Injectable()
export class FileExtensionValidator extends FileValidator<ExtensionValidatorOptions> {
  buildErrorMessage(file: Express.Multer.File): string {
    console.log(file);
    return `Invalid file extension. Allowed extensions are: ${this.validationOptions.allowedExtensions.join(', ')}`;
  }

  isValid(file: Express.Multer.File): boolean {
    const extension = file.originalname.split('.').pop()?.toLowerCase();
    return (
      !!extension &&
      this.validationOptions.allowedExtensions.includes(extension)
    );
  }
}
