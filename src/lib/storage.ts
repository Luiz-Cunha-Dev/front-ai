import type { Message } from '@/types/chat';

const STORAGE_KEY = 'chat-messages';

export const messageStorage = {
  saveMessages: (messages: Message[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
    }
  },

  loadMessages: (): Message[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      return [];
    }
  },

  clearMessages: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar mensagens:', error);
    }
  }
};
