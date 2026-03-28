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

export type AppMode = 'presentation' | 'interview';

export type RoleType =
  | 'software_engineering'
  | 'product_management'
  | 'marketing'
  | 'finance'
  | 'consulting'
  | 'data_science'
  | 'design'
  | 'general';

export interface InterviewConfig {
  jobTitle: string;
  company: string;
  roleType: RoleType;
  jobDescription: string;
  questionCount: number;
  apiKey?: string;
}

export interface InterviewAnswer {
  question: string;
  answer: string;
  feedback?: string;
  followUp?: string;
  followUpAnswer?: string;
}

export interface InterviewResults extends SessionResults {
  interviewAnswers: InterviewAnswer[];
  interviewScore: number;
}

interface SessionContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Presentation mode
  script: string;
  setScript: (script: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;

  // Interview mode
  interviewConfig: InterviewConfig | null;
  setInterviewConfig: (config: InterviewConfig) => void;
  interviewQuestions: string[];
  setInterviewQuestions: (questions: string[]) => void;
  interviewAnswers: InterviewAnswer[];
  setInterviewAnswers: (answers: InterviewAnswer[]) => void;

  // Shared results
  results: SessionResults | null;
  setResults: (results: SessionResults | InterviewResults) => void;
  previousResults: SessionResults | null;
  clearResults: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

const STORAGE_KEY = 'pitchready_prev_results';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('presentation');
  const [script, setScript] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const [scrollSpeed, setScrollSpeed] = useState(2);

  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [interviewAnswers, setInterviewAnswers] = useState<InterviewAnswer[]>([]);

  const [results, setResultsState] = useState<SessionResults | null>(null);
  const [previousResults, setPreviousResults] = useState<SessionResults | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setResults = useCallback((newResults: SessionResults | InterviewResults) => {
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
      mode, setMode,
      script, setScript,
      fontSize, setFontSize,
      scrollSpeed, setScrollSpeed,
      interviewConfig, setInterviewConfig,
      interviewQuestions, setInterviewQuestions,
      interviewAnswers, setInterviewAnswers,
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
