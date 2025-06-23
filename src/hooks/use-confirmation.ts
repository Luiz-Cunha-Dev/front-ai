import { useState } from 'react';

interface UseConfirmationProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmation({
  title = 'Confirmação',
  message = 'Tem certeza?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}: UseConfirmationProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);

  const confirm = (): Promise<boolean> => {
    return new Promise((res) => {
      setIsOpen(true);
      setResolve(() => res);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolve) resolve(true);
    setResolve(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolve) resolve(false);
    setResolve(null);
  };

  // Para usar com window.confirm como fallback
  const simpleConfirm = (customMessage?: string): boolean => {
    return window.confirm(customMessage || message);
  };

  return {
    confirm,
    simpleConfirm,
    isOpen,
    handleConfirm,
    handleCancel,
    title,
    message,
    confirmText,
    cancelText
  };
}
