import { useState, useRef, useCallback, useEffect } from 'react';

const FILLER_WORDS = ['um', 'uh', 'like', 'so', 'basically', 'literally', 'you know', 'actually'];

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [fillerWords, setFillerWords] = useState<Record<string, number>>({});
  const [totalFillers, setTotalFillers] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [wpmSamples, setWpmSamples] = useState<{ time: number; wpm: number }[]>([]);

  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const wordTimestampsRef = useRef<number[]>([]);
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isListeningRef = useRef(false);

  const SpeechRecognitionAPI = typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

  const isSupported = !!SpeechRecognitionAPI;

  const calculateWPM = useCallback(() => {
    const now = Date.now();
    const windowMs = 15000;
    const recentWords = wordTimestampsRef.current.filter(t => now - t < windowMs);
    return recentWords.length > 0
      ? Math.round((recentWords.length / windowMs) * 60000)
      : 0;
  }, []);

  const detectFillers = useCallback((text: string) => {
    const lower = text.toLowerCase();
    const found: Record<string, number> = {};
    let count = 0;

    for (const filler of FILLER_WORDS) {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        found[filler] = matches.length;
        count += matches.length;
      }
    }
    return { found, count };
  }, []);

  const start = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    setTranscript('');
    setInterimTranscript('');
    setWords([]);
    setFillerWords({});
    setTotalFillers(0);
    setCurrentWPM(0);
    setWpmSamples([]);
    wordTimestampsRef.current = [];

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      startTimeRef.current = Date.now();
    };

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interim = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalText.trim()) {
        setTranscript(prev => prev + finalText);

        const newWords = finalText.trim().split(/\s+/).filter((w: string) => w.length > 0);
        const now = Date.now();
        newWords.forEach(() => wordTimestampsRef.current.push(now));
        setWords(prev => [...prev, ...newWords]);

        const { found, count } = detectFillers(finalText);
        if (count > 0) {
          setFillerWords(prev => {
            const updated = { ...prev };
            for (const [word, c] of Object.entries(found)) {
              updated[word] = (updated[word] || 0) + c;
            }
            return updated;
          });
          setTotalFillers(prev => prev + count);
        }
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      if ((event.error === 'no-speech' || event.error === 'aborted') && isListeningRef.current) {
        try { recognition.start(); } catch { /* already started */ }
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try { recognition.start(); } catch { /* already started */ }
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch { /* already started */ }

    wpmIntervalRef.current = setInterval(() => {
      const wpm = calculateWPM();
      setCurrentWPM(wpm);
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setWpmSamples(prev => [...prev, { time: elapsed, wpm }]);
    }, 3000);
  }, [SpeechRecognitionAPI, calculateWPM, detectFillers]);

  const stop = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* not started */ }
      recognitionRef.current = null;
    }
    if (wpmIntervalRef.current) {
      clearInterval(wpmIntervalRef.current);
      wpmIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  return {
    isListening,
    transcript,
    interimTranscript,
    words,
    fillerWords,
    totalFillers,
    currentWPM,
    wpmSamples,
    start,
    stop,
    isSupported,
  };
}
