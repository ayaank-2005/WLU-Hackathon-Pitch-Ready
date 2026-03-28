import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface WPMSample {
  time: number;
  wpm: number;
}

export interface SessionResults {
  duration: number;
  transcript: string;
  fillerWords: Record<string, number>;
  totalFillers: number;
  wpmSamples: WPMSample[];
  averageWPM: number;
  eyeContactPercent: number;
  overallScore: number;
  paceScore: number;
  eyeContactScore: number;
  fillerScore: number;
  tips: string[];
  hasEyeTracking: boolean;
}

interface SessionContextType {
  script: string;
  setScript: (script: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
  results: SessionResults | null;
  setResults: (results: SessionResults) => void;
  previousResults: SessionResults | null;
  clearResults: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

const STORAGE_KEY = 'presentsense_prev_results';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [script, setScript] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [results, setResultsState] = useState<SessionResults | null>(null);
  const [previousResults, setPreviousResults] = useState<SessionResults | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setResults = useCallback((newResults: SessionResults) => {
    if (results) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      } catch { /* quota exceeded, ignore */ }
      setPreviousResults(results);
    }
    setResultsState(newResults);
  }, [results]);

  const clearResults = useCallback(() => {
    setResultsState(null);
  }, []);

  return (
    <SessionContext.Provider value={{
      script, setScript,
      fontSize, setFontSize,
      scrollSpeed, setScrollSpeed,
      results, setResults,
      previousResults,
      clearResults,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}
