import * as fs from 'fs';

import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;
  // console.log(baseImage);

  const pngImagePath = await downloadImageAsPng(baseImage, true);
  // console.log({ pngImagePath });

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  if (
    !response.data ||
    !Array.isArray(response.data) ||
    !response.data[0] ||
    !response.data[0].url
  ) {
    throw new Error('Image editing failed: No data returned from OpenAI');
  }

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
