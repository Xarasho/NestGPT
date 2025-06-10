import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  // const { prompt, originalImage, maskImage } = options;
  const { prompt } = options;

  // TODO: VERIFY ORIGINAL IMAGE

  const response = await openai.images.generate({
    prompt: prompt,
    model: 'dall-e-3',
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  if (
    !response.data ||
    !Array.isArray(response.data) ||
    !response.data[0] ||
    !response.data[0].url
  ) {
    throw new Error('Image generation failed: No data returned from OpenAI');
  }

  // Todo: Save file in file system
  await downloadImageAsPng(response.data[0].url);
  // const fileName = await downloadImageAsPng(response.data[0].url!);

  console.log(response);

  return {
    url: response.data[0].url,
    // localPath: '',
    localPath: '',
    revised_prompt: response.data[0].revised_prompt,
  };
};
