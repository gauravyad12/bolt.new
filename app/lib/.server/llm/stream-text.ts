import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getModel } from './providers';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';
import type { AIProvider } from '~/types/ai';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

interface StreamTextOptions {
  messages: Messages;
  env: Env;
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  modelId?: string;
  options?: StreamingOptions;
}

export function streamText({ messages, env, provider, apiKey, baseUrl, modelId, options }: StreamTextOptions) {
  const model = getModel(provider, apiKey, baseUrl, modelId);
  
  return _streamText({
    model,
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    headers: provider === 'anthropic' ? {
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
    } : undefined,
    messages: convertToCoreMessages(messages),
    ...options,
  });
}