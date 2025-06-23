import { useState } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Falha ao copiar:', err);
      return false;
    }
  };

  return { copied, copyToClipboard };
}
