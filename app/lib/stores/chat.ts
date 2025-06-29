import { map } from 'nanostores';

export type ChatMode = 'agent' | 'general';

export const chatStore = map({
  started: false,
  aborted: false,
  showChat: true,
  mode: 'agent' as ChatMode,
});