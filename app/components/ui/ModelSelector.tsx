import { useStore } from '@nanostores/react';
import { memo, useState } from 'react';
import { aiSettingsStore, getAvailableModels, updateAISettings } from '~/lib/stores/ai';
import { classNames } from '~/utils/classNames';
import type { AIModel } from '~/types/ai';

interface ModelSelectorProps {
  className?: string;
}

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

  return (
    <div className={classNames('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded-md transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <div className={classNames('w-2 h-2 rounded-full', {
            'bg-green-500': currentModel?.provider === 'anthropic',
            'bg-blue-500': currentModel?.provider === 'openai',
            'bg-purple-500': currentModel?.provider === 'gemini',
            'bg-orange-500': currentModel?.provider === 'grok',
            'bg-yellow-500': currentModel?.provider === 'groq',
            'bg-gray-500': currentModel?.provider === 'ollama',
            'bg-red-500': currentModel?.provider === 'custom',
          })} />
          <span className="text-bolt-elements-textPrimary">
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
          <div className="absolute top-full left-0 mt-1 w-64 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
            {availableModels.map((model) => (
              <button
                key={`${model.provider}-${model.id}`}
                onClick={() => handleModelSelect(model)}
                className={classNames(
                  'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-bolt-elements-background-depth-3 transition-colors',
                  {
                    'bg-bolt-elements-background-depth-3': model.id === settings.selectedModel,
                  }
                )}
              >
                <div className={classNames('w-2 h-2 rounded-full flex-shrink-0', {
                  'bg-green-500': model.provider === 'anthropic',
                  'bg-blue-500': model.provider === 'openai',
                  'bg-purple-500': model.provider === 'gemini',
                  'bg-orange-500': model.provider === 'grok',
                  'bg-yellow-500': model.provider === 'groq',
                  'bg-gray-500': model.provider === 'ollama',
                  'bg-red-500': model.provider === 'custom',
                })} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-bolt-elements-textPrimary truncate">
                    {model.name}
                  </div>
                  <div className="text-xs text-bolt-elements-textSecondary capitalize">
                    {model.provider}
                    {model.maxTokens && (
                      <span className="ml-1">• {model.maxTokens} tokens</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});