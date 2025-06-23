import { useState, useRef, useEffect, useCallback } from 'react';

// Declaração de tipos para Speech Recognition
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string) => void;
  onError?: (error: Event) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    continuous = false,
    interimResults = false,
    lang = 'pt-BR',
    onResult,
    onError,
    onStart,
    onEnd
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(true);
      
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recog = new SpeechRecognition() as SpeechRecognition;
      
      recog.continuous = continuous;
      recog.interimResults = interimResults;
      recog.lang = lang;
      
      recog.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          onResult?.(finalTranscript);
        }
      };

      recog.onerror = (error: Event) => {
        setIsRecording(false);
        onError?.(error);
      };

      recog.onstart = () => {
        setIsRecording(true);
        onStart?.();
      };

      recog.onend = () => {
        setIsRecording(false);
        onEnd?.();
      };

      recognitionRef.current = recog;
    }
  }, [continuous, interimResults, lang, onResult, onError, onStart, onEnd]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current || isRecording) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Erro ao iniciar reconhecimento de voz:', error);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Erro ao parar reconhecimento de voz:', error);
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isRecording,
    isSupported,
    transcript,
    startRecording,
    stopRecording,
    toggleRecording,
    resetTranscript
  };
}
