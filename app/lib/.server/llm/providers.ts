import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';
import type { AIProvider } from '~/types/ai';
import { PROVIDER_ENDPOINTS } from '~/types/ai';

export function getModel(provider: AIProvider, apiKey: string, baseUrl?: string, modelId?: string): LanguageModel {
  const finalBaseUrl = baseUrl || PROVIDER_ENDPOINTS[provider];
  
  switch (provider) {
    case 'anthropic': {
      const anthropic = createAnthropic({ 
        apiKey,
        baseURL: finalBaseUrl 
      });
      return anthropic(modelId || 'claude-3-5-sonnet-20240620');
    }
    
    case 'openai': {
      const openai = createOpenAI({ 
        apiKey,
        baseURL: finalBaseUrl 
      });
      return openai(modelId || 'gpt-4o');
    }
    
    case 'gemini': {
      const google = createGoogleGenerativeAI({ 
        apiKey,
        baseURL: finalBaseUrl 
      });
      return google(modelId || 'gemini-1.5-pro');
    }
    
    case 'groq': {
      const groq = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
      });
      return groq(modelId || 'llama-3.1-70b-versatile');
    }
    
    case 'grok': {
      const grok = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
      });
      return grok(modelId || 'grok-beta');
    }
    
    case 'ollama': {
      const ollama = createOpenAI({
        apiKey: 'ollama', // Ollama doesn't require a real API key
        baseURL: finalBaseUrl,
      });
      return ollama(modelId || 'llama3.1');
    }
    
    case 'huggingface': {
      const huggingface = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
      });
      return huggingface(modelId || 'meta-llama/Meta-Llama-3.1-70B-Instruct');
    }
    
    case 'openrouter': {
      const openrouter = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
        defaultHeaders: {
          'HTTP-Referer': 'https://bolt.new',
          'X-Title': 'Bolt.new',
        },
      });
      return openrouter(modelId || 'anthropic/claude-3.5-sonnet');
    }
    
    case 'together': {
      const together = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
      });
      return together(modelId || 'meta-llama/Llama-3-70b-chat-hf');
    }
    
    case 'deepseek': {
      const deepseek = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
      });
      return deepseek(modelId || 'deepseek-chat');
    }
    
    case 'mistral': {
      const mistral = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
      });
      return mistral(modelId || 'mistral-large-latest');
    }
    
    case 'custom': {
      if (!finalBaseUrl) {
        throw new Error('Base URL is required for custom providers');
      }
      const custom = createOpenAI({
        apiKey,
        baseURL: finalBaseUrl,
      });
      return custom(modelId || 'default');
    }
    
    default: {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}