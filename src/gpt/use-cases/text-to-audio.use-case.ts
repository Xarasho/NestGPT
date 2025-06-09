import OpenAI from 'openai';
import * as path from 'path';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices = ['nova', 'alloy'];

  // const selectedVoice = voices[i] ?? 'nova';
  const selectedVoice = voices.includes(voice ?? '')
    ? (voice as string)
    : 'nova';

  const folderPath = path.resolve( __dirname, '../../../generated/audios/')

  return {
    prompt: prompt,
    selectedVoice: selectedVoice,
  };
};
