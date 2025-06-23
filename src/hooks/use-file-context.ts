import { useState, useCallback } from 'react';

interface FileContext {
  fileName: string;
  content: string;
  type: 'pdf' | 'txt';
}

export function useFileContext() {
  const [fileContext, setFileContext] = useState<FileContext | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Importação dinâmica do pdf-parse para evitar problemas de SSR
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configurar o worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((item: any) => ('str' in item ? item.str : ''))
              .join(' ');
            fullText += pageText + '\n';
          }

          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromTXT = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsText(file, 'utf-8');
    });
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setIsExtracting(true);
    
    try {
      let content = '';
      let type: 'pdf' | 'txt';

      if (file.type === 'application/pdf') {
        content = await extractTextFromPDF(file);
        type = 'pdf';
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        content = await extractTextFromTXT(file);
        type = 'txt';
      } else {
        throw new Error('Tipo de arquivo não suportado. Use apenas PDF ou TXT.');
      }

      setFileContext({
        fileName: file.name,
        content: content.trim(),
        type
      });

      return content;
    } catch (error) {
      console.error('Erro ao extrair texto do arquivo:', error);
      throw error;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const clearFileContext = useCallback(() => {
    setFileContext(null);
  }, []);

  const getContextForAI = useCallback(() => {
    if (!fileContext) return '';
    
    return `[CONTEXTO DO ARQUIVO ${fileContext.fileName.toUpperCase()}]\n${fileContext.content}\n[FIM DO CONTEXTO]\n\n`;
  }, [fileContext]);

  return {
    fileContext,
    isExtracting,
    handleFileUpload,
    clearFileContext,
    getContextForAI
  };
}
