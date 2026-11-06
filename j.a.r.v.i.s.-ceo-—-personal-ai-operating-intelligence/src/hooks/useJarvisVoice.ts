import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseJarvisVoiceOptions {
  language: 'uz' | 'en' | 'ru';
  onCommandRecognized?: (command: string) => void;
  autoSpeakResponse?: boolean;
}

export function useJarvisVoice({
  language,
  onCommandRecognized,
  autoSpeakResponse = true
}: UseJarvisVoiceOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wakeWordActive, setWakeWordActive] = useState(true);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check speech synthesis availability
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setVoiceAvailable(true);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API is not supported in this browser environment.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        const currentText = final || interim;
        setTranscript(currentText);

        // Check for wake word trigger
        const lower = currentText.toLowerCase();
        if (
          lower.includes('hey jarvis') ||
          lower.includes('salom jarvis') ||
          lower.includes('привет джарвис')
        ) {
          // Play wake audio cue or highlight
          const cleanCommand = currentText
            .replace(/hey jarvis|salom jarvis|привет джарвис/gi, '')
            .trim();
          if (cleanCommand.length > 2 && onCommandRecognized) {
            onCommandRecognized(cleanCommand);
            setTranscript('');
          }
        } else if (final && onCommandRecognized) {
          onCommandRecognized(final);
          setTranscript('');
        }
      };

      recognition.onerror = (err: any) => {
        if (err.error === 'not-allowed') {
          setPermissionError('Microphone permission denied.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e: any) {
      console.warn('SpeechRecognition initialization error:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [language, onCommandRecognized]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // might already be started
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // ignore
    }
  }, []);

  // Speak text with natural speech synthesis
  const speakText = useCallback(
    (text: string) => {
      if (!synthRef.current || !autoSpeakResponse) return;

      // Cancel previous speech if any
      synthRef.current.cancel();

      // Clean markdown tags, emojis, and codeblocks for clear voice output
      const cleanVoiceText = text
        .replace(/```[\s\S]*?```/g, 'Code block omitted.')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[#*_~>\[\]\(\)]/g, ' ')
        .replace(/\n+/g, '. ')
        .slice(0, 450); // limit spoken slice to prevent runaway speech

      const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      const voices = synthRef.current.getVoices();
      if (language === 'uz') {
        // Try Uzbek or Turkish/Russian fallback
        const matched = voices.find(v => v.lang.startsWith('uz') || v.lang.startsWith('tr') || v.lang.startsWith('ru'));
        if (matched) utterance.voice = matched;
      } else if (language === 'ru') {
        const matched = voices.find(v => v.lang.startsWith('ru'));
        if (matched) utterance.voice = matched;
      } else {
        const matched = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel')));
        if (matched) utterance.voice = matched;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [autoSpeakResponse, language]
  );

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    wakeWordActive,
    voiceAvailable,
    permissionError,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    setWakeWordActive
  };
}
