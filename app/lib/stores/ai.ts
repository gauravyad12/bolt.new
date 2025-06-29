import { atom, map, type MapStore, type WritableAtom } from 'nanostores';
import type { AIProvider, AIModel, AIProviderConfig, CustomAIConfig, DEFAULT_MODELS } from '~/types/ai';
import { DEFAULT_MODELS as MODELS } from '~/types/ai';

export interface AISettings {
  selectedProvider: AIProvider;
  selectedModel: string;
  providers: Record<AIProvider, AIProviderConfig>;
  customConfigs: CustomAIConfig[];
}

const defaultProviders: Record<AIProvider, AIProviderConfig> = {
  anthropic: {
    provider: 'anthropic',
    models: MODELS.anthropic,
    enabled: true,
  },
  openai: {
    provider: 'openai',
    models: MODELS.openai,
    enabled: false,
  },
  gemini: {
    provider: 'gemini',
    models: MODELS.gemini,
    enabled: false,
  },
  grok: {
    provider: 'grok',
    models: MODELS.grok,
    enabled: false,
  },
  groq: {
    provider: 'groq',
    models: MODELS.groq,
    enabled: false,
  },
  ollama: {
    provider: 'ollama',
    baseUrl: 'http://localhost:11434',
    models: MODELS.ollama,
    enabled: false,
  },
  custom: {
    provider: 'custom',
    models: [],
    enabled: false,
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