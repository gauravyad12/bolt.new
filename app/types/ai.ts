export type AIProvider = 
  | 'anthropic' 
  | 'openai' 
  | 'gemini' 
  | 'grok' 
  | 'groq' 
  | 'ollama' 
  | 'huggingface'
  | 'openrouter'
  | 'together'
  | 'deepseek'
  | 'mistral'
  | 'custom';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  maxTokens?: number;
  contextWindow?: number;
  description?: string;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  models: AIModel[];
  enabled: boolean;
  description?: string;
}

export interface CustomAIConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
}

export const DEFAULT_MODELS: Record<AIProvider, AIModel[]> = {
  anthropic: [
    { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: 'anthropic', maxTokens: 8192, contextWindow: 200000, description: 'Most capable model for complex tasks' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', maxTokens: 4096, contextWindow: 200000, description: 'Fast and efficient for simple tasks' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic', maxTokens: 4096, contextWindow: 200000, description: 'Most powerful model for complex reasoning' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 4096, contextWindow: 128000, description: 'Latest multimodal model' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', maxTokens: 16384, contextWindow: 128000, description: 'Faster and cheaper GPT-4o' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', maxTokens: 4096, contextWindow: 128000, description: 'Enhanced GPT-4 with improved performance' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 4096, contextWindow: 16385, description: 'Fast and cost-effective' },
  ],
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', maxTokens: 8192, contextWindow: 2000000, description: 'Google\'s most capable model' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', maxTokens: 8192, contextWindow: 1000000, description: 'Faster version of Gemini Pro' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini', maxTokens: 2048, contextWindow: 32768, description: 'Balanced performance and speed' },
  ],
  grok: [
    { id: 'grok-beta', name: 'Grok Beta', provider: 'grok', maxTokens: 4096, contextWindow: 131072, description: 'xAI\'s conversational AI' },
    { id: 'grok-vision-beta', name: 'Grok Vision Beta', provider: 'grok', maxTokens: 4096, contextWindow: 131072, description: 'Grok with vision capabilities' },
  ],
  groq: [
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', provider: 'groq', maxTokens: 8192, contextWindow: 131072, description: 'Meta\'s large language model' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', provider: 'groq', maxTokens: 8192, contextWindow: 131072, description: 'Faster Llama model' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq', maxTokens: 32768, contextWindow: 32768, description: 'Mistral\'s mixture of experts model' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', provider: 'groq', maxTokens: 8192, contextWindow: 8192, description: 'Google\'s open model' },
  ],
  ollama: [
    { id: 'llama3.1', name: 'Llama 3.1', provider: 'ollama', maxTokens: 4096, contextWindow: 131072, description: 'Local Llama model' },
    { id: 'codellama', name: 'Code Llama', provider: 'ollama', maxTokens: 4096, contextWindow: 16384, description: 'Specialized for code generation' },
    { id: 'mistral', name: 'Mistral', provider: 'ollama', maxTokens: 4096, contextWindow: 32768, description: 'Local Mistral model' },
    { id: 'phi3', name: 'Phi-3', provider: 'ollama', maxTokens: 4096, contextWindow: 131072, description: 'Microsoft\'s small language model' },
  ],
  huggingface: [
    { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B Instruct', provider: 'huggingface', maxTokens: 4096, contextWindow: 131072, description: 'Meta\'s instruction-tuned model' },
    { id: 'microsoft/DialoGPT-large', name: 'DialoGPT Large', provider: 'huggingface', maxTokens: 1024, contextWindow: 1024, description: 'Conversational AI model' },
    { id: 'bigscience/bloom', name: 'BLOOM', provider: 'huggingface', maxTokens: 2048, contextWindow: 2048, description: 'Multilingual large language model' },
    { id: 'codellama/CodeLlama-34b-Instruct-hf', name: 'Code Llama 34B', provider: 'huggingface', maxTokens: 4096, contextWindow: 16384, description: 'Code generation model' },
  ],
  openrouter: [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'openrouter', maxTokens: 8192, contextWindow: 200000, description: 'Via OpenRouter' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openrouter', maxTokens: 4096, contextWindow: 128000, description: 'Via OpenRouter' },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'openrouter', maxTokens: 8192, contextWindow: 131072, description: 'Via OpenRouter' },
    { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'openrouter', maxTokens: 8192, contextWindow: 2000000, description: 'Via OpenRouter' },
  ],
  together: [
    { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B Chat', provider: 'together', maxTokens: 8192, contextWindow: 8192, description: 'Meta\'s chat model' },
    { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', provider: 'together', maxTokens: 32768, contextWindow: 32768, description: 'Mistral\'s mixture model' },
    { id: 'togethercomputer/RedPajama-INCITE-Chat-3B-v1', name: 'RedPajama Chat 3B', provider: 'together', maxTokens: 2048, contextWindow: 2048, description: 'Open source chat model' },
    { id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', name: 'Nous Hermes 2 Mixtral', provider: 'together', maxTokens: 32768, contextWindow: 32768, description: 'Fine-tuned Mixtral model' },
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', maxTokens: 4096, contextWindow: 32768, description: 'DeepSeek\'s conversational model' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'deepseek', maxTokens: 4096, contextWindow: 16384, description: 'Specialized for code generation' },
    { id: 'deepseek-math', name: 'DeepSeek Math', provider: 'deepseek', maxTokens: 4096, contextWindow: 4096, description: 'Specialized for mathematical reasoning' },
  ],
  mistral: [
    { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'mistral', maxTokens: 8192, contextWindow: 128000, description: 'Mistral\'s most capable model' },
    { id: 'mistral-medium-latest', name: 'Mistral Medium', provider: 'mistral', maxTokens: 4096, contextWindow: 32768, description: 'Balanced performance model' },
    { id: 'mistral-small-latest', name: 'Mistral Small', provider: 'mistral', maxTokens: 4096, contextWindow: 32768, description: 'Fast and efficient model' },
    { id: 'codestral-latest', name: 'Codestral', provider: 'mistral', maxTokens: 4096, contextWindow: 32768, description: 'Specialized for code generation' },
  ],
  custom: [],
};

export const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  anthropic: 'https://api.anthropic.com',
  openai: 'https://api.openai.com/v1',
  gemini: 'https://generativelanguage.googleapis.com/v1beta',
  grok: 'https://api.x.ai/v1',
  groq: 'https://api.groq.com/openai/v1',
  ollama: 'http://localhost:11434/v1',
  huggingface: 'https://api-inference.huggingface.co/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  together: 'https://api.together.xyz/v1',
  deepseek: 'https://api.deepseek.com/v1',
  mistral: 'https://api.mistral.ai/v1',
  custom: '',
};