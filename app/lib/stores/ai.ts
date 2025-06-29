import { atom, type WritableAtom } from 'nanostores';
import type { AIProvider, AIModel, AIProviderConfig, CustomAIConfig } from '~/types/ai';
import { DEFAULT_MODELS, PROVIDER_ENDPOINTS } from '~/types/ai';

export interface AISettings {
  selectedProvider: AIProvider;
  selectedModel: string;
  providers: Record<AIProvider, AIProviderConfig>;
  customConfigs: CustomAIConfig[];
}

const defaultProviders: Record<AIProvider, AIProviderConfig> = {
  anthropic: {
    provider: 'anthropic',
    models: DEFAULT_MODELS.anthropic,
    enabled: true,
    description: 'Claude models by Anthropic',
  },
  openai: {
    provider: 'openai',
    models: DEFAULT_MODELS.openai,
    enabled: false,
    description: 'GPT models by OpenAI',
  },
  gemini: {
    provider: 'gemini',
    models: DEFAULT_MODELS.gemini,
    enabled: false,
    description: 'Gemini models by Google',
  },
  grok: {
    provider: 'grok',
    models: DEFAULT_MODELS.grok,
    enabled: false,
    description: 'Grok models by xAI',
  },
  groq: {
    provider: 'groq',
    models: DEFAULT_MODELS.groq,
    enabled: false,
    description: 'Fast inference with Groq',
  },
  ollama: {
    provider: 'ollama',
    baseUrl: PROVIDER_ENDPOINTS.ollama,
    models: DEFAULT_MODELS.ollama,
    enabled: false,
    description: 'Local models with Ollama',
  },
  huggingface: {
    provider: 'huggingface',
    models: DEFAULT_MODELS.huggingface,
    enabled: false,
    description: 'Open source models via HuggingFace',
  },
  openrouter: {
    provider: 'openrouter',
    models: DEFAULT_MODELS.openrouter,
    enabled: false,
    description: 'Multiple providers via OpenRouter',
  },
  together: {
    provider: 'together',
    models: DEFAULT_MODELS.together,
    enabled: false,
    description: 'Open source models via Together AI',
  },
  deepseek: {
    provider: 'deepseek',
    models: DEFAULT_MODELS.deepseek,
    enabled: false,
    description: 'DeepSeek models for reasoning and coding',
  },
  mistral: {
    provider: 'mistral',
    models: DEFAULT_MODELS.mistral,
    enabled: false,
    description: 'Mistral AI models',
  },
  custom: {
    provider: 'custom',
    models: [],
    enabled: false,
    description: 'Custom API endpoints',
  },
};

const defaultSettings: AISettings = {
  selectedProvider: 'anthropic',
  selectedModel: 'claude-3-5-sonnet-20240620',
  providers: defaultProviders,
  customConfigs: [],
};

function loadSettings(): AISettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const stored = localStorage.getItem('bolt_ai_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load AI settings:', error);
  }
  
  return defaultSettings;
}

function saveSettings(settings: AISettings) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('bolt_ai_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save AI settings:', error);
  }
}

export const aiSettingsStore: WritableAtom<AISettings> = atom(loadSettings());

// Subscribe to changes and save to localStorage
aiSettingsStore.subscribe((settings) => {
  saveSettings(settings);
});

export function updateAISettings(updates: Partial<AISettings>) {
  const current = aiSettingsStore.get();
  aiSettingsStore.set({ ...current, ...updates });
}

export function updateProviderConfig(provider: AIProvider, config: Partial<AIProviderConfig>) {
  const current = aiSettingsStore.get();
  aiSettingsStore.set({
    ...current,
    providers: {
      ...current.providers,
      [provider]: { ...current.providers[provider], ...config },
    },
  });
}

export function addCustomConfig(config: CustomAIConfig) {
  const current = aiSettingsStore.get();
  aiSettingsStore.set({
    ...current,
    customConfigs: [...current.customConfigs, config],
  });
}

export function removeCustomConfig(name: string) {
  const current = aiSettingsStore.get();
  aiSettingsStore.set({
    ...current,
    customConfigs: current.customConfigs.filter(c => c.name !== name),
  });
}

export function getAvailableModels(): AIModel[] {
  const settings = aiSettingsStore.get();
  const models: AIModel[] = [];
  
  Object.values(settings.providers).forEach(provider => {
    if (provider.enabled && provider.apiKey) {
      models.push(...provider.models);
    }
  });
  
  // Add custom models
  settings.customConfigs.forEach(config => {
    config.models.forEach(modelId => {
      models.push({
        id: modelId,
        name: modelId,
        provider: 'custom',
      });
    });
  });
  
  return models;
}

export function getCurrentModel(): AIModel | undefined {
  const settings = aiSettingsStore.get();
  const availableModels = getAvailableModels();
  return availableModels.find(model => model.id === settings.selectedModel);
}