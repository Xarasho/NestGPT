import OpenAI from 'openai';

export const createThreadUseCase = async (openai: OpenAI) => {
  const { id } = await openai.beta.threads.create();
  // console.log({ thread });
  return { id };
};
