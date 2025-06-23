"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Bot,
  User,
  Trash2,
  Mic,
  MicOff,
  File,
  FileText,
  X,
  Square,
  ChevronDown,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import MessageContent from "@/components/MessageContent";
import { ThemeToggle } from "@/components/theme-toggle";
import { CopyMessageButton } from "@/components/CopyMessageButton";
import { useMessages } from "@/hooks/use-messages";
import { useChatApi } from "@/hooks/use-chat-api";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { useChatInput } from "@/hooks/use-chat-input";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useFileContext } from "@/hooks/use-file-context";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { FileUpload } from "@/components/FileUpload";

export default function Chat() {
  const { input, setInput, clearInput } = useChatInput();
  const { messages, addMessage, updateMessage, clearMessages } = useMessages();
  const { sendMessage, isLoading, cancelGeneration } = useChatApi({
    onAddMessage: addMessage,
    onUpdateMessage: updateMessage,
  });
  const { scrollAreaRef, isAutoScrollEnabled, forceScrollToBottom } = useScrollToBottom(messages);
  const { simpleConfirm } = useConfirmation({
    message:
      "Tem certeza que deseja limpar todo o histórico do chat? Esta ação não pode ser desfeita.",
  });

  // Hook para reconhecimento de voz
  const { isRecording, isSupported, toggleRecording } = useSpeechRecognition({
    continuous: false,
    interimResults: false,
    lang: "pt-BR",
    onResult: (transcript) => {
      setInput((prev) => prev + transcript);
    },
    onError: (error) => {
      console.error("Erro no reconhecimento de voz:", error);
    },
  });

  // Hook para contexto de arquivo
  const {
    fileContext,
    isExtracting,
    handleFileUpload,
    clearFileContext,
    getContextForAI,
  } = useFileContext();

  // Hook para drag and drop
  const { isDragOver, dragHandlers } = useDragAndDrop({
    onFileUpload: handleFileUpload,
    acceptedTypes: ['application/pdf', 'text/plain'],
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Salvar informação do arquivo anexado para exibição
    const attachedFileInfo = fileContext ? {
      fileName: fileContext.fileName,
      type: fileContext.type
    } : undefined;

    // Preparar a mensagem com contexto do arquivo para a IA
    const contextPrefix = getContextForAI();
    const messageWithContext = contextPrefix + input;

    // Enviar a mensagem (a função sendMessage adiciona a mensagem do usuário)
    await sendMessage(messageWithContext, input, attachedFileInfo);
    clearInput();
    
    // Limpar o contexto do arquivo após enviar
    if (fileContext) {
      clearFileContext();
    }
  };

  const handleClearChat = () => {
    if (simpleConfirm()) {
      clearMessages();
    }
  };

  // Atalhos de teclado
  useKeyboardShortcuts([
    {
      key: "k",
      ctrlKey: true,
      callback: handleClearChat,
    },
  ]);

  return (
    <div 
      className="flex flex-col h-screen max-w-4xl mx-auto bg-background text-foreground transition-colors duration-200 relative"
      {...dragHandlers}
    >
      {/* Overlay de drag and drop */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary z-50 flex items-center justify-center">
          <div className="text-center p-6 bg-background/90 rounded-lg shadow-lg">
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Solte o arquivo aqui
            </h3>
            <p className="text-sm text-muted-foreground">
              Arquivos suportados: PDF, TXT
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="border-b border-border p-3 sm:p-4 bg-background/95 backdrop-blur-sm shadow-sm dark:shadow-md dark:shadow-black/10">
        {/* Layout Mobile */}
        <div className="flex flex-col gap-3 sm:hidden">
          {/* Primeira linha mobile: Título e Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Chat com IA
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Converse com a inteligência artificial
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Segunda linha mobile: Botão Limpar */}
          {messages.length > 0 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 cursor-pointer text-xs"
                title="Limpar conversa (Ctrl+K)"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Limpar
              </Button>
            </div>
          )}
        </div>

        {/* Layout Desktop */}
        <div className="hidden sm:flex items-center justify-between">
          {/* Botão Limpar - Esquerda */}
          <div className="flex items-center">
            {messages.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 cursor-pointer"
                title="Limpar conversa (Ctrl+K)"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            ) : (
              <div className="w-[80px]">
                {/* Espaço reservado para manter o título centralizado */}
              </div>
            )}
          </div>

          {/* Título - Centro */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Chat com IA
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Converse com a inteligência artificial
            </p>
          </div>

          {/* Theme Toggle - Direita */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-2 sm:p-4 bg-background/50"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-3 sm:p-4 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
              <Bot className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
              Bem-vindo ao Chat IA!
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Digite uma mensagem para começar a conversar
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1 ring-2 ring-primary/20 dark:ring-primary/30 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground shadow-md">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[85%] min-w-40 sm:max-w-[70%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground dark:shadow-primary/20"
                      : "bg-card text-card-foreground border border-border dark:bg-card/80 dark:shadow-black/10"
                  }`}
                >
                  <MessageContent
                    content={message.content}
                    role={message.role}
                    isLoading={message.isLoading}
                    attachedFile={message.attachedFile}
                    onCancel={message.role === 'assistant' && message.isLoading ? cancelGeneration : undefined}
                  />
                  <span className="text-xs opacity-70 mt-2 sm:mt-8 block relative">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                    {message.role === "assistant" && (
                      <CopyMessageButton content={message.content} />
                    )}
                  </span>
                </div>

                {message.role === "user" && (
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1 ring-2 ring-secondary/30 flex-shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground shadow-md">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Botão para voltar ao fim da conversa */}
      {!isAutoScrollEnabled && messages.length > 0 && (
        <div className="absolute bottom-20 right-4 sm:bottom-24 sm:right-6 z-10">
          <Button
            onClick={forceScrollToBottom}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 rounded-full cursor-pointer"
            title="Voltar ao fim da conversa"
          >
            <ChevronDown className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Ir para o fim</span>
            <span className="sm:hidden">Fim</span>
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3 sm:p-4 bg-background/95 backdrop-blur-sm">
        {/* Mostrar arquivo anexado ou processamento */}
        {(fileContext || isExtracting) && (
          <div className="mb-3 flex items-center justify-between p-2 bg-primary/10 text-primary rounded-md text-sm">
            <div className="flex items-center gap-2">
              {isExtracting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span>Processando arquivo...</span>
                </>
              ) : fileContext ? (
                <>
                  {fileContext.type === "pdf" ? (
                    <File className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>Arquivo anexado: {fileContext.fileName}</span>
                </>
              ) : null}
            </div>
            {fileContext && !isExtracting && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-destructive/20 cursor-pointer"
                onClick={clearFileContext}
                disabled={isLoading}
                title="Remover arquivo"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        <div className="gap-2 flex justify-center items-center">
          <div className="pb-1">
            <FileUpload
              onFileUpload={handleFileUpload}
              isExtracting={isExtracting}
              fileContext={fileContext}
              onClearFile={clearFileContext}
              disabled={isLoading}
              variant="icon-only"
            />
          </div>

          <div className="relative flex-1">
            <Textarea
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInput(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder=""
              disabled={isLoading}
              rows={1}
              className="border-border focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all duration-200 resize-none max-h-[120px] sm:max-h-[200px] leading-5 text-sm sm:text-base"
              style={{
                height: "auto",
                minHeight: "2.5rem",
                overflow:
                  input.split("\n").length > 1 || input.length > 50
                    ? "auto"
                    : "hidden",
              }}
              onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                const target = e.target as HTMLTextAreaElement;
                const maxHeight =
                  typeof window !== "undefined" && window.innerWidth < 640
                    ? 120
                    : 200;
                target.style.height = "auto";
                target.style.height =
                  Math.min(target.scrollHeight, maxHeight) + "px";
              }}
            />
            {!input && (
              <div className="absolute inset-0 flex items-start pt-2 px-3 pointer-events-none overflow-hidden">
                <span className="text-gray-500 text-sm sm:text-base truncate">
                  {isRecording
                    ? "🎤 Gravando... fale agora"
                    : "Digite sua mensagem"}
                </span>
              </div>
            )}
          </div>

          {isSupported && (
            <Button
              onClick={toggleRecording}
              size="icon"
              className={`${
                isRecording
                  ? "bg-red-500 hover:bg-red-400"
                  : "bg-primary hover:bg-primary/90"
              } text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 h-9 w-9 sm:h-10 sm:w-10 cursor-pointer flex-shrink-0`}
              disabled={isLoading}
              title={
                isRecording ? "Parar gravação" : "Iniciar gravação por voz"
              }
            >
              {isRecording ? (
                <MicOff className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
          )}

          {isLoading ? (
            <Button
              onClick={cancelGeneration}
              size="icon"
              className="bg-red-500 hover:bg-red-400 text-white shadow-md hover:shadow-lg transition-all duration-200 h-9 w-9 sm:h-10 sm:w-10 cursor-pointer flex-shrink-0"
              title="Cancelar geração"
            >
              <Square className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 h-9 w-9 sm:h-10 sm:w-10 cursor-pointer flex-shrink-0"
              title="Enviar mensagem"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
        
      </div>
    </div>
  );
}
