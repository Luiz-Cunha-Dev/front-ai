import { useState, useCallback, DragEvent } from 'react';

interface UseDragAndDropOptions {
  onFileUpload: (file: File) => Promise<string>;
  acceptedTypes?: string[];
}

export function useDragAndDrop({ onFileUpload, acceptedTypes = ['application/pdf', 'text/plain'] }: UseDragAndDropOptions) {
  const [isDragOver, setIsDragOver] = useState(false);

  const isValidFile = useCallback((file: File) => {
    // Verificar tipo de arquivo
    if (acceptedTypes.includes(file.type)) return true;
    
    // Verificar extensão para arquivos .txt que podem não ter o tipo correto
    if (file.name.toLowerCase().endsWith('.txt')) return true;
    if (file.name.toLowerCase().endsWith('.pdf')) return true;
    
    return false;
  }, [acceptedTypes]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Só remove o drag over se realmente saiu da área de drop
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;

    const file = files[0]; // Pegar apenas o primeiro arquivo
    
    if (!isValidFile(file)) {
      alert('Tipo de arquivo não suportado. Use apenas arquivos PDF ou TXT.');
      return;
    }

    try {
      await onFileUpload(file);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      alert(error instanceof Error ? error.message : 'Erro ao processar o arquivo');
    }
  }, [onFileUpload, isValidFile]);

  return {
    isDragOver,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}
