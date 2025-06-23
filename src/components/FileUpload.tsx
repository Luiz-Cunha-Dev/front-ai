import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, FileText, File } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string>;
  isExtracting: boolean;
  fileContext: { fileName: string; type: 'pdf' | 'txt' } | null;
  onClearFile: () => void;
  disabled?: boolean;
  variant?: 'full' | 'icon-only';
}

export function FileUpload({ 
  onFileUpload, 
  isExtracting, 
  fileContext, 
  onClearFile, 
  disabled, 
  variant = 'full' 
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onFileUpload(file);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      alert(error instanceof Error ? error.message : 'Erro ao processar o arquivo');
    }

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    event.target.value = '';
  };

  if (variant === 'icon-only') {
    return (
      <>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 cursor-pointer"
          onClick={handleFileSelect}
          disabled={disabled || isExtracting}
          title="Adicionar arquivo PDF ou TXT como contexto"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,text/plain,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {fileContext ? (
        <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
          {fileContext.type === 'pdf' ? (
            <File className="w-3 h-3" />
          ) : (
            <FileText className="w-3 h-3" />
          )}
          <span className="max-w-[100px] truncate">{fileContext.fileName}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0 hover:bg-destructive/20"
            onClick={onClearFile}
            disabled={disabled}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={handleFileSelect}
          disabled={disabled || isExtracting}
          title="Adicionar arquivo PDF ou TXT como contexto"
        >
          <Paperclip className="w-4 h-4" />
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,text/plain,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {isExtracting && (
        <span className="text-xs text-muted-foreground">Processando...</span>
      )}
    </div>
  );
}
