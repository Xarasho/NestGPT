import * as path from 'path';
import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

export const downloadImageAsPng = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new InternalServerErrorException('Image download failed');
  }

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);
};

// import * as path from 'path';
// import * as fs from 'fs';
// import { InternalServerErrorException } from '@nestjs/common';
// import fetch from 'node-fetch';

// export const downloadImageAsPng = async (url: string): Promise<string> => {
//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new InternalServerErrorException('Image download failed');
//   }

//   const folderPath = path.resolve('./', './generated/images/');
//   fs.mkdirSync(folderPath, { recursive: true });

//   const imageNamePng = `${Date.now()}.png`;
//   const filePath = path.join(folderPath, imageNamePng);
//   const buffer = Buffer.from(await response.arrayBuffer());

//   fs.writeFileSync(filePath, buffer);

//   return filePath;
// };
