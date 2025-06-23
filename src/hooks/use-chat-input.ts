import { useState } from 'react';

export function useChatInput() {
  const [input, setInput] = useState('');

  const clearInput = () => setInput('');

  const handleKeyPress = (
    e: React.KeyboardEvent,
    onSend: () => void
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return {
    input,
    setInput,
    clearInput,
    handleKeyPress
  };
}
