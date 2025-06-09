import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices = ['nova', 'alloy', 'echo', 'fable', 'onyx', 'shimmer'];
  // const voices = {
  //   nova: 'nova',
  //   alloy: 'alloy',
  //   echo: 'echo',
  //   fable: 'fable',
  //   onyx: 'onyx',
  //   shimmer: 'shimmer',
  // };

  // const selectedVoice = voices[voice] ?? 'nova';
  const selectedVoice = voices.includes(voice ?? '')
    ? (voice as string)
    : 'nova';

  const folderPath = path.resolve(__dirname, '../../../generated/audios/');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  // console.log(mp3);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  fs.mkdirSync(folderPath, { recursive: true });

  return speechFile;
  // return {
  //   prompt: prompt,
  //   selectedVoice: selectedVoice,
  // };
};
