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
    huggingface: 'HuggingFace',
    openrouter: 'OpenRouter',
    together: 'Together AI',
    deepseek: 'DeepSeek',
    mistral: 'Mistral AI',
    custom: 'Custom Endpoint',
  };

  const providerColors = {
    anthropic: 'bg-orange-500',
    openai: 'bg-green-500',
    gemini: 'bg-blue-500',
    grok: 'bg-purple-500',
    groq: 'bg-yellow-500',
    ollama: 'bg-gray-500',
    huggingface: 'bg-yellow-600',
    openrouter: 'bg-indigo-500',
    together: 'bg-teal-500',
    deepseek: 'bg-cyan-500',
    mistral: 'bg-red-500',
    custom: 'bg-pink-500',
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
          You can get API keys from the respective provider websites.
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
                  <div className={classNames('w-3 h-3 rounded-full', 
                    providerColors[provider as AIProvider]
                  )} />
                  <div>
                    <span className="font-medium text-bolt-elements-textPrimary">
                      {providerLabels[provider as AIProvider]}
                    </span>
                    {config.description && (
                      <p className="text-xs text-bolt-elements-textTertiary mt-0.5">
                        {config.description}
                      </p>
                    )}
                  </div>
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
                      placeholder={`Enter your ${providerLabels[provider as AIProvider]} API key`}
                      className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                    />
                  </div>

                  {(provider === 'ollama' || provider === 'custom' || provider === 'huggingface' || provider === 'openrouter' || provider === 'together' || provider === 'deepseek' || provider === 'mistral') && (
                    <div>
                      <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                        Base URL
                      </label>
                      <input
                        type="url"
                        value={config.baseUrl || ''}
                        onChange={(e) => handleBaseUrlChange(provider as AIProvider, e.target.value)}
                        placeholder={getPlaceholderUrl(provider as AIProvider)}
                        className="w-full px-3 py-2 border border-bolt-elements-borderColor rounded-md bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive"
                      />
                    </div>
                  )}

                  <div className="text-xs text-bolt-elements-textTertiary">
                    <strong>Available models:</strong> {config.models.map(m => m.name).join(', ')}
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
                  placeholder="https://api.example.com/v1"
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

      {/* API Key Help */}
      <div className="p-4 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-lg">
        <h4 className="font-medium text-bolt-elements-textPrimary mb-2">Getting API Keys</h4>
        <div className="space-y-1 text-sm text-bolt-elements-textSecondary">
          <p><strong>Anthropic:</strong> <a href="https://console.anthropic.com/" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">console.anthropic.com</a></p>
          <p><strong>OpenAI:</strong> <a href="https://platform.openai.com/api-keys" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">platform.openai.com/api-keys</a></p>
          <p><strong>Google:</strong> <a href="https://makersuite.google.com/app/apikey" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">makersuite.google.com/app/apikey</a></p>
          <p><strong>Groq:</strong> <a href="https://console.groq.com/keys" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">console.groq.com/keys</a></p>
          <p><strong>HuggingFace:</strong> <a href="https://huggingface.co/settings/tokens" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">huggingface.co/settings/tokens</a></p>
          <p><strong>OpenRouter:</strong> <a href="https://openrouter.ai/keys" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">openrouter.ai/keys</a></p>
          <p><strong>Together AI:</strong> <a href="https://api.together.xyz/settings/api-keys" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">api.together.xyz/settings/api-keys</a></p>
          <p><strong>DeepSeek:</strong> <a href="https://platform.deepseek.com/api_keys" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">platform.deepseek.com/api_keys</a></p>
          <p><strong>Mistral:</strong> <a href="https://console.mistral.ai/api-keys/" target=\"_blank" rel="noopener noreferrer\" className="text-bolt-elements-messages-linkColor hover:underline">console.mistral.ai/api-keys</a></p>
        </div>
      </div>
    </div>
  );
});

function getPlaceholderUrl(provider: AIProvider): string {
  switch (provider) {
    case 'ollama':
      return 'http://localhost:11434/v1';
    case 'huggingface':
      return 'https://api-inference.huggingface.co/v1';
    case 'openrouter':
      return 'https://openrouter.ai/api/v1';
    case 'together':
      return 'https://api.together.xyz/v1';
    case 'deepseek':
      return 'https://api.deepseek.com/v1';
    case 'mistral':
      return 'https://api.mistral.ai/v1';
    default:
      return 'https://api.example.com/v1';
  }
}