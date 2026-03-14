import { create } from 'zustand';

type ChatMessage = { role: 'bot' | 'user'; content: string };

interface ChatState {
  conversationId?: string;
  scenarioId?: string;
  messages: ChatMessage[];
  options: string[];
  setConversation: (conversationId: string, scenarioId: string) => void;
  addMessage: (message: ChatMessage) => void;
  setOptions: (options: string[]) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  options: [],
  setConversation: (conversationId, scenarioId) => set({ conversationId, scenarioId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setOptions: (options) => set({ options }),
  reset: () => set({ messages: [], conversationId: undefined, options: [], scenarioId: undefined })
}));
