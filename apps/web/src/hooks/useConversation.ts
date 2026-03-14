import { useState } from 'react';
import { sendConversationMessage, startConversation } from '../lib/api';
import { useChatStore } from '../stores/chatStore';

export function useConversation() {
  const [loading, setLoading] = useState(false);
  const store = useChatStore();

  async function begin(scenarioId: string) {
    setLoading(true);
    const response = await startConversation(scenarioId);
    store.reset();
    store.setConversation(response.conversationId, scenarioId);
    store.addMessage({ role: 'bot', content: String(response.currentNode.content) });
    setLoading(false);
  }

  async function send(message: string) {
    if (!store.conversationId) return;
    store.addMessage({ role: 'user', content: message });
    setLoading(true);
    const response = await sendConversationMessage(store.conversationId, message);
    const botMessage = response.messages?.[0]?.content ?? 'No response.';
    store.addMessage({ role: 'bot', content: String(botMessage) });
    store.setOptions(response.availableOptions ?? []);
    setLoading(false);
  }

  return {
    loading,
    begin,
    send,
    ...store
  };
}
