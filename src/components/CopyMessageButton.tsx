import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CopyMessageButtonProps {
  content: string;
}

export function CopyMessageButton({ content }: CopyMessageButtonProps) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(content);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="absolute bottom-0 right-0 h-7 px-2 text-xs opacity-60 hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border border-border cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 mr-1 text-green-600" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="h-3 w-3 mr-1" />
          Copiar
        </>
      )}
    </Button>
  );
}
