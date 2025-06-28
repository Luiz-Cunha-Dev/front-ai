# AI Chat

A modern AI chat application built with Next.js, offering an interactive and intuitive experience to converse with artificial intelligence.

## Features

### 🎯 Smart Chat
- Clean and responsive interface
- Light/dark theme support
- Conversation history
- Quick chat clearing (Ctrl+K)

### 🎤 Voice Recognition
- Voice command using the Web Speech API
- Support for Brazilian Portuguese
- Visual feedback during recording
- Automatic operation in compatible browsers

### 📎 File Upload for Context
- Support for PDF and TXT files
- Automatic text extraction
- Invisible context for the user (used only by the AI)
- Intuitive interface to manage files

### ⌨️ Keyboard Shortcuts
- `Enter`: Send message
- `Shift + Enter`: New line
- `Ctrl + K`: Clear chat

## Technologies Used

- **Next.js 14** - React Framework
- **TypeScript** - Static typing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **PDF.js** - PDF text extraction
- **Web Speech API** - Voice recognition

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd front-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/chat/stream/route.ts    # Chat API
│   └── ...
├── components/
│   ├── Chat.tsx                    # Main component
│   ├── FileUpload.tsx              # File upload
│   └── ui/                         # UI components
├── hooks/
│   ├── use-speech-recognition.ts   # Voice hook
│   ├── use-file-context.ts         # File hook
│   └── ...
└── lib/
    └── utils.ts                    # Utilities
```

## How to Use

### Basic Chat
1. Type your message in the input field
2. Press Enter or click the send button
3. Wait for the AI's response

### Voice Recognition
1. Click the microphone icon 🎤
2. Speak your message
3. The text will be automatically inserted into the field

### File Upload
1. Click the attachment icon 📎
2. Select a PDF or TXT file
3. The file will be processed and used as context for the AI
4. To remove, click the X next to the file name

## API Configuration

Configure your chat API in the file [`src/app/api/chat/stream/route.ts`](src/app/api/chat/stream/route.ts).

## Deploy

To deploy on Vercel:

```bash
npm run build
vercel --prod
```

## Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE`