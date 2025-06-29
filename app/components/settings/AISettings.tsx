import { useStore } from '@nanostores/react';
import { memo, useState } from 'react';
import { aiSettingsStore, updateProviderConfig, addCustomConfig, removeCustomConfig } from '~/lib/stores/ai';
import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import type { AIProvider, CustomAIConfig } from '~/types/ai';

export const AISettings = memo(() => {
  const settings = useStore(aiSettingsStore);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState<Partial<CustomAIConfig>>({});

  const providerLabels: Record<AIProvider, string> = {
    anthropic: 'Anthropic Claude',
    openai: 'OpenAI GPT',
    gemini: 'Google Gemini',
    grok: 'xAI Grok',
    groq: 'Groq',
    ollama: 'Ollama (Local)',
    custom: 'Custom Endpoint',
  };

  const handleProviderToggle = (provider: AIProvider) => {
    updateProviderConfig(provider, {
      enabled: !settings.providers[provider].enabled,
    });
  };

  const handleApiKeyChange = (provider: AIProvider, apiKey: string) => {
    updateProviderConfig(provider, { apiKey });
  };

  const handleBaseUrlChange = (provider: AIProvider, baseUrl: string) => {
    updateProviderConfig(provider, { baseUrl });
  };

  const handleAddCustomConfig = () => {
    if (customForm.name && customForm.baseUrl && customForm.apiKey && customForm.models) {
      addCustomConfig({
        name: customForm.name,
        baseUrl: customForm.baseUrl,
        apiKey: customForm.apiKey,
        models: customForm.models,
      });
      setCustomForm({});
      setShowCustomForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-4">
          AI Provider Settings
        </h3>
        <p className="text-sm text-bolt-elements-textSecondary mb-6">
          Configure your AI providers and API keys. Enable providers to use their models in chat.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(settings.providers).map(([provider, config]) => {
          if (provider === 'custom') return null;
          
          return (
            <div
              key={provider}
              className="p-4 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={classNames('w-3 h-3 rounded-full', {
                    'bg-green-500': provider === 'anthropic',
                    'bg-blue-500': provider === 'openai',
                    'bg-purple-500': provider === 'gemini',
                    'bg-orange-500': provider === 'grok',
                    'bg-yellow-500': provider === 'groq',
                    'bg-gray-500': provider === 'ollama',
                  })} />
                  <span className="font-medium text-bolt-elements-textPrimary">
                    {providerLabels[provider as AIProvider]}
                  </span>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => handleProviderToggle(provider as AIProvider)}
                    className="rounded border-bolt-elements-borderColor"
                  />
                  <span className="text-sm text-bolt-elements-textSecondary">Enabled</span>
                </label>
              </div>

              {config.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={config.apiKey || ''}
                      onChange={(e) => handleApiKeyChange(provider as AIProvider, e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                    />
                  </div>

                  {(provider === 'ollama' || provider === 'custom') && (
                    <div>
                      <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                        Base URL
                      </label>
                      <input
                        type="url"
                        value={config.baseUrl || ''}
                        onChange={(e) => handleBaseUrlChange(provider as AIProvider, e.target.value)}
                        placeholder={provider === 'ollama' ? 'http://localhost:11434' : 'https://api.example.com'}
                        className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                      />
                    </div>
                  )}

                  <div className="text-xs text-bolt-elements-textTertiary">
                    Available models: {config.models.map(m => m.name).join(', ')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Configurations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-bolt-elements-textPrimary">Custom Endpoints</h4>
          <button
            onClick={() => setShowCustomForm(true)}
            className="px-3 py-1.5 text-sm bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text rounded-md transition-colors"
          >
            Add Custom
          </button>
        </div>

        {settings.customConfigs.map((config) => (
          <div
            key={config.name}
            className="p-4 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-1 mb-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-bolt-elements-textPrimary">{config.name}</div>
                <div className="text-sm text-bolt-elements-textSecondary">{config.baseUrl}</div>
                <div className="text-xs text-bolt-elements-textTertiary mt-1">
                  Models: {config.models.join(', ')}
                </div>
              </div>
              <IconButton
                icon="i-ph:trash"
                onClick={() => removeCustomConfig(config.name)}
                className="text-bolt-elements-item-contentDanger hover:bg-bolt-elements-item-backgroundDanger"
              />
            </div>
          </div>
        ))}

        {showCustomForm && (
          <div className="p-4 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-1">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                  Configuration Name
                </label>
                <input
                  type="text"
                  value={customForm.name || ''}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  placeholder="My Custom AI"
                  className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                  Base URL
                </label>
                <input
                  type="url"
                  value={customForm.baseUrl || ''}
                  onChange={(e) => setCustomForm({ ...customForm, baseUrl: e.target.value })}
                  placeholder="https://api.example.com"
                  className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={customForm.apiKey || ''}
                  onChange={(e) => setCustomForm({ ...customForm, apiKey: e.target.value })}
                  placeholder="Enter API key"
                  className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                  Available Models (comma-separated)
                </label>
                <input
                  type="text"
                  value={customForm.models?.join(', ') || ''}
                  onChange={(e) => setCustomForm({ 
                    ...customForm, 
                    models: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                  })}
                  placeholder="model-1, model-2, model-3"
                  className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddCustomConfig}
                  className="px-3 py-1.5 text-sm bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text rounded-md transition-colors"
                >
                  Add Configuration
                </button>
                <button
                  onClick={() => {
                    setShowCustomForm(false);
                    setCustomForm({});
                  }}
                  className="px-3 py-1.5 text-sm bg-bolt-elements-button-secondary-background hover:bg-bolt-elements-button-secondary-backgroundHover text-bolt-elements-button-secondary-text rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});