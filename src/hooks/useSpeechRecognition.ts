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
  const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isListeningRef = useRef(false);
  const processedIndicesRef = useRef<Set<number>>(new Set());
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordCountRef = useRef(0);
  const wordCountHistoryRef = useRef<{ time: number; count: number }[]>([]);

  const SpeechRecognitionAPI = typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

  const isSupported = !!SpeechRecognitionAPI;

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
    wordCountRef.current = 0;
    wordCountHistoryRef.current = [];
    processedIndicesRef.current = new Set();
    startTimeRef.current = Date.now();

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
    };

    recognition.onresult = (event: any) => {
      let newFinalText = '';
      let interim = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          if (!processedIndicesRef.current.has(i)) {
            processedIndicesRef.current.add(i);
            newFinalText += result[0].transcript + ' ';
          }
        } else {
          interim += result[0].transcript;
        }
      }

      if (newFinalText.trim()) {
        setTranscript(prev => prev + newFinalText);

        const newWords = newFinalText.trim().split(/\s+/).filter((w: string) => w.length > 0);
        wordCountRef.current += newWords.length;
        setWords(prev => [...prev, ...newWords]);

        const { found, count } = detectFillers(newFinalText);
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
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        isListeningRef.current = false;
        setIsListening(false);
        return;
      }
      if (isListeningRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            processedIndicesRef.current = new Set();
            try { recognition.start(); } catch { /* already running */ }
          }
        }, 300);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            processedIndicesRef.current = new Set();
            try { recognition.start(); } catch { /* already running */ }
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch { /* already started */ }

    wordCountHistoryRef.current.push({ time: Date.now(), count: 0 });

    wpmIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const total = wordCountRef.current;

      wordCountHistoryRef.current.push({ time: now, count: total });

      if (elapsed < 3000) {
        setCurrentWPM(0);
        return;
      }

      const history = wordCountHistoryRef.current;

      // Use a 15-second sliding window, or full elapsed if < 15s
      const windowMs = Math.min(15000, elapsed);
      const cutoff = now - windowMs;

      // Find the snapshot closest to the window start
      let baseCount = 0;
      let baseTime = startTimeRef.current;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].time <= cutoff) {
          baseCount = history[i].count;
          baseTime = history[i].time;
          break;
        }
      }

      const timeDiff = now - baseTime;
      if (timeDiff < 2000) return;

      const wordDiff = total - baseCount;
      const wpm = Math.round((wordDiff / timeDiff) * 60000);

      setCurrentWPM(wpm);
      const elapsedSec = elapsed / 1000;
      setWpmSamples(prev => [...prev, { time: elapsedSec, wpm }]);
    }, 2000);
  }, [SpeechRecognitionAPI, detectFillers]);

  const stop = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
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
