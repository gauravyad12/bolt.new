import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { IconButton } from '~/components/ui/IconButton';
import { SettingsModal } from '~/components/settings/SettingsModal';

interface HeaderActionButtonsProps {}

export function HeaderActionButtons({}: HeaderActionButtonsProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const { showChat, mode } = useStore(chatStore);
  const [showSettings, setShowSettings] = useState(false);

  const canHideChat = showWorkbench || !showChat;

  const toggleChatMode = () => {
    chatStore.setKey('mode', mode === 'agent' ? 'general' : 'agent');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Chat Mode Toggle */}
      <div className="flex items-center gap-1 bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-lg p-1">
        <button
          onClick={toggleChatMode}
          className={classNames(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
            {
              'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent shadow-sm': mode === 'agent',
              'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive': mode !== 'agent',
            }
          )}
        >
          <div className="i-ph:robot text-lg" />
          Agent
        </button>
        <button
          onClick={toggleChatMode}
          className={classNames(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
            {
              'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent shadow-sm': mode === 'general',
              'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive': mode !== 'general',
            }
          )}
        >
          <div className="i-ph:chat-circle text-lg" />
          Chat
        </button>
      </div>

      <IconButton
        icon="i-ph:gear"
        title="Settings"
        onClick={() => setShowSettings(true)}
        className="text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive"
      />
      
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
        <Button
          active={showChat}
          disabled={!canHideChat}
          onClick={() => {
            if (canHideChat) {
              chatStore.setKey('showChat', !showChat);
            }
          }}
        >
          <div className="i-bolt:chat text-sm" />
        </Button>
        <div className="w-[1px] bg-bolt-elements-borderColor" />
        <Button
          active={showWorkbench}
          onClick={() => {
            if (showWorkbench && !showChat) {
              chatStore.setKey('showChat', true);
            }

            workbenchStore.showWorkbench.set(!showWorkbench);
          }}
        >
          <div className="i-ph:code-bold" />
        </Button>
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: VoidFunction;
}

function Button({ active = false, disabled = false, children, onClick }: ButtonProps) {
  return (
    <button
      className={classNames('flex items-center p-1.5', {
        'bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary':
          !active,
        'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': active && !disabled,
        'bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed':
          disabled,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
}