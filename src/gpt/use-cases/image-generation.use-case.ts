import * as fs from 'fs';
// import * as path from 'path';

import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  // TODO: VERIFY ORIGINAL IMAGE
  if (!originalImage || !maskImage) {
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
    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
    // console.log(response);

    return {
      url: url,
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  // originalImage= http://172.26.16.116:3000/gpt/image-generation/1749597767837.png
  // maskImage=Base64;fakdsjhf9784t7239p2qy5p94h5p4959q8435ugvn845845nq84y5gvn84q25
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  // const imageBuffer = fs.readFileSync(pngImagePath);
  // const maskBuffer = fs.readFileSync(maskPath);
  // const imageFile = new File([imageBuffer], 'image.png', {
  //   type: 'image/png',
  // });

  // const maskFile = new File([maskBuffer], 'mask.png', {
  //   type: 'image/png',
  // });

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt: prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
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

  // const localImagePath = await downloadImageAsPng(response.data[0].url);
  // const fileName = path.basename(localImagePath);
  // const publicUrl = `localhost:3000/${fileName}`;

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
