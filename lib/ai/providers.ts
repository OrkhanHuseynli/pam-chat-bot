import {
  customProvider,
  embed,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { createOpenAI } from '@ai-sdk/openai';
const GPT_MODEL = process.env.GPT_MODEL || "gpt-4o"; // "ChatGPT-4o"; // "gpt-4o-mini"; //"gpt-4o";
const BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';


export const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: BASE_URL});

const openaiProviderConfig = {
  languageModels: {
    'chat-model': openai(GPT_MODEL),
    'chat-model-reasoning': wrapLanguageModel({
      model: openai('o3'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': openai('o3-mini'),
    'artifact-model': openai('o3-mini'),
  },
  imageModels: {
    'small-model': openai.image('o3-mini'),
  },
  embeddingModels: {
    'text-embedding-3-large': openai.embedding('text-embedding-3-large'),
  }
}

const xProviderConfig = {
  languageModels: {
    'chat-model': xai('grok-2-vision-1212'),
    'chat-model-reasoning': wrapLanguageModel({
      model: xai('grok-3-mini-beta'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': xai('grok-2-1212'),
    'artifact-model': xai('grok-2-1212'),
  },
  imageModels: {
    'small-model': xai.image('grok-2-image'),
  },
}

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider(openaiProviderConfig);
