import { useState, useEffect } from 'react';
import { messageStorage } from '@/lib/storage';
import type { Message } from '@/types/chat';

export function useMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    // Carregar mensagens do localStorage na inicialização
    useEffect(() => {
        const storedMessages = messageStorage.loadMessages();
            setMessages(storedMessages);
    }, []);

    // Salvar mensagens no localStorage sempre que mudarem
    useEffect(() => {
        if (messages.length > 0) {
            messageStorage.saveMessages(messages);
        }
    }, [messages]);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const updateMessage = (id: string, content: string) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === id
                    ? { ...msg, content, isLoading: false }
                    : msg
            )
        );
    };

    const clearMessages = () => {
        setMessages([]);
        messageStorage.clearMessages();
    };

    return {
        messages,
        addMessage,
        updateMessage,
        clearMessages,
        setMessages
    };
}
