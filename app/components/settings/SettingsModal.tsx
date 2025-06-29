import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { AISettings } from './AISettings';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'ai' | 'general' | 'shortcuts';

const tabs: { id: SettingsTab; label: string; icon: string }[] = [
  { id: 'ai', label: 'AI Providers', icon: 'i-ph:robot' },
  { id: 'general', label: 'General', icon: 'i-ph:gear' },
  { id: 'shortcuts', label: 'Shortcuts', icon: 'i-ph:keyboard' },
];

export const SettingsModal = memo(({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ai');

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 z-max"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: cubicEasingFn }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed top-[50%] left-[50%] z-max max-h-[85vh] w-[90vw] max-w-4xl translate-x-[-50%] translate-y-[-50%] border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-2 shadow-lg focus:outline-none overflow-hidden"
                initial={{ opacity: 0, scale: 0.96, x: '-50%', y: '-40%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.96, x: '-50%', y: '-40%' }}
                transition={{ duration: 0.15, ease: cubicEasingFn }}
              >
                <div className="flex h-[600px]">
                  {/* Sidebar */}
                  <div className="w-64 bg-bolt-elements-background-depth-1 border-r border-bolt-elements-borderColor">
                    <div className="p-4 border-b border-bolt-elements-borderColor">
                      <h2 className="text-lg font-semibold text-bolt-elements-textPrimary">Settings</h2>
                    </div>
                    <nav className="p-2">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={classNames(
                            'w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors',
                            {
                              'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': activeTab === tab.id,
                              'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive': activeTab !== tab.id,
                            }
                          )}
                        >
                          <div className={classNames(tab.icon, 'text-lg')} />
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-bolt-elements-borderColor">
                      <h3 className="text-lg font-medium text-bolt-elements-textPrimary">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                      </h3>
                      <Dialog.Close asChild>
                        <IconButton icon="i-ph:x" onClick={onClose} />
                      </Dialog.Close>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                      {activeTab === 'ai' && <AISettings />}
                      {activeTab === 'general' && (
                        <div className="text-bolt-elements-textSecondary">
                          General settings coming soon...
                        </div>
                      )}
                      {activeTab === 'shortcuts' && (
                        <div className="text-bolt-elements-textSecondary">
                          Keyboard shortcuts settings coming soon...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});