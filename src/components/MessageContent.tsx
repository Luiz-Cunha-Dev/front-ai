import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Check, File, FileText } from 'lucide-react';
import { useState } from 'react';
import { useCurrentTheme } from '@/hooks/use-current-theme';
import type { AttachedFile } from '@/types/chat';

interface MessageContentProps {
  content: string;
  role: 'user' | 'assistant';
  isLoading?: boolean;
  attachedFile?: AttachedFile;
  onCancel?: () => void;
}

interface CodeComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Componente para botão de copiar código
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copyToClipboard}
      className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background border border-border opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

// Componente de loading para mensagens
function LoadingMessage() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}


export default function MessageContent({ content, role, isLoading, attachedFile }: MessageContentProps) {
  const isDark = useCurrentTheme();
  
  if (role === 'user') {
    return (
      <div className="space-y-2">
        {/* Indicador de arquivo anexado */}
        {attachedFile && (
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 dark:bg-primary/20 rounded-md border border-primary/20">
            {attachedFile.type === 'pdf' ? (
              <File className="w-4 h-4 text-primary" />
            ) : (
              <FileText className="w-4 h-4 text-primary" />
            )}
            <span className="text-sm text-primary font-medium">
              {attachedFile.fileName}
            </span>
          </div>
        )}
        
        {/* Conteúdo da mensagem */}
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    );
  }

  // Mostrar loading para mensagens do assistente quando isLoading é true
  if (isLoading) {
    return <LoadingMessage />;
  }

  return (
    <div className="relative w-full">
      <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-transparent prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-li:text-foreground break-words">
        <ReactMarkdown
          components={{
            code: ({ className, children, ...props }: CodeComponentProps) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              const codeString = String(children).replace(/\n$/, '');
              
              if (isInline) {
                return (
                  <code 
                    className="bg-muted/80 border border-border px-1.5 py-0.5 rounded text-sm font-mono text-foreground" 
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              
              return (
                <div className="my-3 rounded-lg overflow-hidden border border-border shadow-sm relative">
                  <CopyCodeButton code={codeString} />
                  <div className="[&_*]:!border-none [&_span]:!border-none [&_div]:!border-none">
                    <SyntaxHighlighter
                      style={isDark ? vscDarkPlus : vs}
                      language={match[1]}
                      PreTag="div"
                      className="!m-0 [&_*]:!border-none"
                      showLineNumbers={false}
                      wrapLines={false}
                      customStyle={{
                        background: isDark ? '#1e1e1e !important' : '#ffffff !important',
                        padding: '1rem',
                        margin: 0,
                        fontSize: '14px',
                        fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, "Courier New", monospace',
                        lineHeight: '1.5',
                        border: 'none !important',
                        borderRadius: '0',
                        overflow: 'auto',
                      }}
                      codeTagProps={{
                        style: {
                          background: 'transparent !important',
                          color: 'inherit !important',
                          border: 'none !important',
                          borderTop: 'none !important',
                          borderBottom: 'none !important',
                        }
                      }}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 mt-4 text-foreground">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mb-2 mt-3 text-foreground">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mb-2 mt-3 text-foreground">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 leading-relaxed text-foreground break-words">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-2 space-y-1 text-foreground">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-2 space-y-1 text-foreground">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed text-foreground">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/60 bg-muted/30 pl-4 py-2 italic my-3 rounded-r text-foreground">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-foreground">{children}</em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
