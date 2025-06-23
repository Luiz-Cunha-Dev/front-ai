export interface AttachedFile {
  fileName: string;
  type: 'pdf' | 'txt';
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  attachedFile?: AttachedFile;
}
