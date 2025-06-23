import { useState, useRef } from 'react';
import type { Message, AttachedFile } from '@/types/chat';

interface UseChatApiProps {
  onAddMessage: (message: Message) => void;
  onUpdateMessage: (id: string, content: string) => void;
}

export function useChatApi({ onAddMessage, onUpdateMessage }: UseChatApiProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (messageWithContext: string, userDisplayText?: string, attachedFile?: AttachedFile) => {
    if (!messageWithContext.trim() || isLoading) return;

    // Criar AbortController para cancelar a requisição
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userDisplayText || messageWithContext,
      role: 'user',
      timestamp: new Date(),
      attachedFile,
    };

    // Criar mensagem do assistente com loading imediatamente
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    onAddMessage(userMessage);
    onAddMessage(assistantMessage);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageWithContext }),
        signal: abortController.signal, // Adicionar signal para cancelamento
      });

      if (!response.ok) {
        throw new Error('Falha na requisição');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Não foi possível ler a resposta');
      }

      while (true) {
        // Verificar se foi cancelado antes de cada leitura
        if (abortController.signal.aborted) {
          reader.cancel();
          return;
        }

        const { done, value } = await reader.read();
        if (done) break;

        // Verificar se foi cancelado antes de processar cada chunk
        if (abortController.signal.aborted) {
          reader.cancel();
          break;
        }

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk' && data.content) {
                // Remove o loading indicator assim que o primeiro chunk chegar
                if (assistantMessage.isLoading) {
                  assistantMessage.isLoading = false;
                  setIsTyping(false);
                }
                assistantMessage.content += data.content;
                onUpdateMessage(assistantMessage.id, assistantMessage.content);
              } else if (data.type === 'done') {
                assistantMessage.isLoading = false;
                setIsLoading(false);
                setIsTyping(false);
                return;
              }
            } catch {
              // Ignora linhas que não são JSON válido
            }
          }
        }
      }
    } catch (error) {
      // Verificar se o erro foi devido ao cancelamento
      if (error instanceof Error && error.name === 'AbortError') {
        // Mensagem foi cancelada - não logar como erro
        assistantMessage.content += '\n\n*[Geração cancelada pelo usuário]*';
        assistantMessage.isLoading = false;
        onUpdateMessage(assistantMessage.id, assistantMessage.content);
      } else {
        // Logar apenas erros reais, não cancelamentos
        console.error('Erro ao enviar mensagem:', error);
        
        // Outro tipo de erro
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
          role: 'assistant',
          timestamp: new Date(),
        };
        onAddMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const cancelGeneration = () => {
    if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
      try {
        abortControllerRef.current.abort();
      } catch {
        // Ignorar erros de cancelamento
        console.debug('Cancelamento já realizado ou não necessário');
      }
    }
  };

  return {
    sendMessage,
    isLoading,
    isTyping,
    cancelGeneration
  };
}
