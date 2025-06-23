import { useRef, useEffect, useState, useCallback } from 'react';
import type { Message } from '@/types/chat';

export function useScrollToBottom(messages: Message[]) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const previousMessagesLength = useRef(messages.length);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  const isNearBottom = useCallback(() => {
    if (!scrollAreaRef.current) return true;
    
    const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollElement) return true;
    
    const threshold = 100; // pixels from bottom
    const position = scrollElement.scrollTop + scrollElement.clientHeight;
    const height = scrollElement.scrollHeight;
    
    return position >= height - threshold;
  }, []);

  // Detectar quando o usuário faz scroll manual
  const handleScroll = useCallback(() => {
    if (isNearBottom()) {
      setIsAutoScrollEnabled(true);
    } else {
      setIsAutoScrollEnabled(false);
    }
  }, [isNearBottom]);

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    // Se o número de mensagens aumentou (nova mensagem), sempre fazer scroll
    if (messages.length > previousMessagesLength.current) {
      setIsAutoScrollEnabled(true);
      scrollToBottom();
      previousMessagesLength.current = messages.length;
    }
    // Se apenas o conteúdo mudou (streaming), só fazer scroll se estiver habilitado
    else if (isAutoScrollEnabled) {
      scrollToBottom();
    }
  }, [messages, isAutoScrollEnabled, scrollToBottom]);

  return { 
    scrollAreaRef, 
    scrollToBottom, 
    isAutoScrollEnabled,
    forceScrollToBottom: () => {
      setIsAutoScrollEnabled(true);
      scrollToBottom();
    }
  };
}
