import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';
import type { AIProvider } from '~/types/ai';

export function getModel(provider: AIProvider, apiKey: string, baseUrl?: string, modelId?: string): LanguageModel {
  switch (provider) {
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey });
      return anthropic(modelId || 'claude-3-5-sonnet-20240620');
    }
    
    case 'openai': {
      const openai = createOpenAI({ 
        apiKey,
        baseURL: baseUrl 
      });
      return openai(modelId || 'gpt-4o');
    }
    
    case 'gemini': {
      const google = createGoogleGenerativeAI({ apiKey });
      return google(modelId || 'gemini-1.5-pro');
    }
    
    case 'groq': {
      const groq = createOpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      return groq(modelId || 'llama-3.1-70b-versatile');
    }
    
    case 'grok': {
      const grok = createOpenAI({
        apiKey,
        baseURL: 'https://api.x.ai/v1',
      });
      return grok(modelId || 'grok-beta');
    }
    
    case 'ollama': {
      const ollama = createOpenAI({
        apiKey: 'ollama', // Ollama doesn't require a real API key
        baseURL: baseUrl || 'http://localhost:11434/v1',
      });
      return ollama(modelId || 'llama3.1');
    }
    
    case 'custom': {
      if (!baseUrl) {
        throw new Error('Base URL is required for custom providers');
      }
      const custom = createOpenAI({
        apiKey,
        baseURL: baseUrl,
      });
      return custom(modelId || 'default');
    }
    
    default: {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}