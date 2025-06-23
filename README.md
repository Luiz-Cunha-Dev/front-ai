# Chat com IA

Uma aplicação moderna de chat com inteligência artificial construída com Next.js, oferecendo uma experiência interativa e intuitiva para conversar com IA.

## Funcionalidades

### 🎯 Chat Inteligente
- Interface limpa e responsiva
- Suporte a temas claro/escuro
- Histórico de conversas
- Limpeza rápida do chat (Ctrl+K)

### 🎤 Reconhecimento de Voz
- Comando por voz usando a Web Speech API
- Suporte para português brasileiro
- Feedback visual durante a gravação
- Funcionamento automático em navegadores compatíveis

### 📎 Upload de Arquivos para Contexto
- Suporte para arquivos PDF e TXT
- Extração automática de texto
- Contexto invisível ao usuário (usado apenas pela IA)
- Interface intuitiva para gerenciar arquivos

### ⌨️ Atalhos de Teclado
- `Enter`: Enviar mensagem
- `Shift + Enter`: Quebrar linha
- `Ctrl + K`: Limpar chat

## Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **PDF.js** - Extração de texto de PDFs
- **Web Speech API** - Reconhecimento de voz

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd front-ai
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/chat/stream/route.ts    # API de chat
│   └── ...
├── components/
│   ├── Chat.tsx                    # Componente principal
│   ├── FileUpload.tsx             # Upload de arquivos
│   └── ui/                        # Componentes UI
├── hooks/
│   ├── use-speech-recognition.ts   # Hook para voz
│   ├── use-file-context.ts        # Hook para arquivos
│   └── ...
└── lib/
    └── utils.ts                    # Utilitários
```

## Como Usar

### Chat Básico
1. Digite sua mensagem no campo de entrada
2. Pressione Enter ou clique no botão de envio
3. Aguarde a resposta da IA

### Reconhecimento de Voz
1. Clique no ícone do microfone 🎤
2. Fale sua mensagem
3. O texto será automaticamente inserido no campo

### Upload de Arquivos
1. Clique no ícone de anexo 📎
2. Selecione um arquivo PDF ou TXT
3. O arquivo será processado e usado como contexto para a IA
4. Para remover, clique no X ao lado do nome do arquivo

## Configuração da API

Configure sua API de chat no arquivo `src/app/api/chat/stream/route.ts`.

## Deploy

Para fazer deploy na Vercel:

```bash
npm run build
vercel --prod
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
