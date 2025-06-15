import OpenAI from 'openai';

interface CheckStatusResult {
  status: string;
  // add other properties as needed
}

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
): Promise<CheckStatusResult> => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  console.log({ status: runStatus.status }); // completed

  if (runStatus.status === 'completed') {
    return runStatus;
  }

  // Wait a second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await checkCompleteStatusUseCase(openai, options);
};
