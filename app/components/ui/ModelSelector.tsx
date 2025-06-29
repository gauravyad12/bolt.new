import { useStore } from '@nanostores/react';
import { memo, useState } from 'react';
import { aiSettingsStore, getAvailableModels, updateAISettings } from '~/lib/stores/ai';
import { classNames } from '~/utils/classNames';
import type { AIModel } from '~/types/ai';

interface ModelSelectorProps {
  className?: string;
}

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

export const ModelSelector = memo(({ className }: ModelSelectorProps) => {
  const settings = useStore(aiSettingsStore);
  const [isOpen, setIsOpen] = useState(false);
  const availableModels = getAvailableModels();
  
  const currentModel = availableModels.find(model => model.id === settings.selectedModel);
  
  const handleModelSelect = (model: AIModel) => {
    updateAISettings({
      selectedModel: model.id,
      selectedProvider: model.provider,
    });
    setIsOpen(false);
  };

  if (availableModels.length === 0) {
    return (
      <div className={classNames('text-xs text-bolt-elements-textTertiary', className)}>
        No models available
      </div>
    );
  }

  // Group models by provider
  const modelsByProvider = availableModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, AIModel[]>);

  return (
    <div className={classNames('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded-md transition-colors min-w-[200px]"
      >
        <div className="flex items-center gap-1.5 flex-1">
          <div className={classNames('w-2 h-2 rounded-full', 
            providerColors[currentModel?.provider || 'custom']
          )} />
          <span className="text-bolt-elements-textPrimary truncate">
            {currentModel?.name || 'Select Model'}
          </span>
        </div>
        <div className={classNames('i-ph:caret-down text-bolt-elements-textSecondary transition-transform', {
          'rotate-180': isOpen,
        })} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-80 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
            {Object.entries(modelsByProvider).map(([provider, models]) => (
              <div key={provider}>
                <div className="px-3 py-2 text-xs font-medium text-bolt-elements-textSecondary bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor capitalize">
                  {provider}
                </div>
                {models.map((model) => (
                  <button
                    key={`${model.provider}-${model.id}`}
                    onClick={() => handleModelSelect(model)}
                    className={classNames(
                      'w-full flex items-start gap-3 px-3 py-3 text-left hover:bg-bolt-elements-background-depth-3 transition-colors border-b border-bolt-elements-borderColor last:border-b-0',
                      {
                        'bg-bolt-elements-background-depth-3': model.id === settings.selectedModel,
                      }
                    )}
                  >
                    <div className={classNames('w-2 h-2 rounded-full flex-shrink-0 mt-1', 
                      providerColors[model.provider]
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-bolt-elements-textPrimary truncate">
                        {model.name}
                      </div>
                      {model.description && (
                        <div className="text-xs text-bolt-elements-textTertiary mt-0.5">
                          {model.description}
                        </div>
                      )}
                      <div className="text-xs text-bolt-elements-textSecondary mt-1">
                        {model.maxTokens && (
                          <span>{model.maxTokens} tokens</span>
                        )}
                        {model.contextWindow && (
                          <span className="ml-2">{model.contextWindow.toLocaleString()} context</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});