export type AIProvider = 'anthropic' | 'openai' | 'gemini' | 'grok' | 'groq' | 'ollama' | 'custom';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  maxTokens?: number;
  contextWindow?: number;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  models: AIModel[];
  enabled: boolean;
}

export interface CustomAIConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
}

export const DEFAULT_MODELS: Record<AIProvider, AIModel[]> = {
  anthropic: [
    { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: 'anthropic', maxTokens: 8192, contextWindow: 200000 },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', maxTokens: 4096, contextWindow: 200000 },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', maxTokens: 4096, contextWindow: 200000 },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 4096, contextWindow: 128000 },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', maxTokens: 16384, contextWindow: 128000 },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', maxTokens: 4096, contextWindow: 128000 },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 4096, contextWindow: 16385 },
  ],
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', maxTokens: 8192, contextWindow: 2000000 },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', maxTokens: 8192, contextWindow: 1000000 },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini', maxTokens: 2048, contextWindow: 32768 },
  ],
  grok: [
    { id: 'grok-beta', name: 'Grok Beta', provider: 'grok', maxTokens: 4096, contextWindow: 131072 },
    { id: 'grok-vision-beta', name: 'Grok Vision Beta', provider: 'grok', maxTokens: 4096, contextWindow: 131072 },
  ],
  groq: [
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', provider: 'groq', maxTokens: 8192, contextWindow: 131072 },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', provider: 'groq', maxTokens: 8192, contextWindow: 131072 },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq', maxTokens: 32768, contextWindow: 32768 },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', provider: 'groq', maxTokens: 8192, contextWindow: 8192 },
  ],
  ollama: [
    { id: 'llama3.1', name: 'Llama 3.1', provider: 'ollama', maxTokens: 4096, contextWindow: 131072 },
    { id: 'codellama', name: 'Code Llama', provider: 'ollama', maxTokens: 4096, contextWindow: 16384 },
    { id: 'mistral', name: 'Mistral', provider: 'ollama', maxTokens: 4096, contextWindow: 32768 },
    { id: 'phi3', name: 'Phi-3', provider: 'ollama', maxTokens: 4096, contextWindow: 131072 },
  ],
  custom: [],
};