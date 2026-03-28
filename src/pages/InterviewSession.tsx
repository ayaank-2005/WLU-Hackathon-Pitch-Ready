import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Timer, Eye, Activity, MessageSquareWarning, Mic,
  Video, VideoOff, Square, ArrowLeft, AlertCircle,
  ChevronRight, Loader2, CheckCircle2, XCircle, Send
} from 'lucide-react';
import { useSession, type InterviewAnswer, type InterviewResults } from '../context/SessionContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useEyeTracking } from '../hooks/useEyeTracking';
import { useTimer } from '../hooks/useTimer';
import { computeResults } from '../lib/analytics';
import { evaluateAnswer, evaluateAnswerHeuristic, type AnswerEvaluation } from '../lib/openai';

type Phase = 'setup' | 'active' | 'answering' | 'evaluating' | 'feedback' | 'followup';

export default function InterviewSession() {
  const navigate = useNavigate();
  const session = useSession();
  const timer = useTimer();
  const speech = useSpeechRecognition();
  const eyeTracking = useEyeTracking();

  const [phase, setPhase] = useState<Phase>('setup');
  const [hasCamera, setHasCamera] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [permissionError, setPermissionError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentEval, setCurrentEval] = useState<AnswerEvaluation | null>(null);
  const [followUpTranscript, setFollowUpTranscript] = useState('');
  const [isFollowUp, setIsFollowUp] = useState(false);

  const [allTranscripts, setAllTranscripts] = useState('');
  const [allWords, setAllWords] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const questions = session.interviewQuestions;
  const config = session.interviewConfig;
  const apiKey = config?.apiKey;
  const currentQuestion = questions[currentIndex] ?? '';
  const totalQuestions = questions.length;

  useEffect(() => {
    if (!questions.length || !config) navigate('/interview/setup');
  }, [questions, config, navigate]);

  const requestPermissions = async () => {
    setPermissionError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setHasCamera(true);
      setHasMic(true);
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setHasMic(true);
      } catch {
        setPermissionError('Please allow at least microphone access to practice.');
      }
    }
  };

  const startInterview = () => {
    setPhase('answering');
  };

  useEffect(() => {
    if (phase !== 'answering' || timer.seconds > 0) return;

    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }

    timer.start();
    speech.start();

    if (hasCamera && streamRef.current) {
      eyeTracking.startTracking(streamRef.current);
    }
  }, [phase]);

  const submitAnswer = useCallback(async () => {
    const answerText = speech.transcript.trim();
    speech.stop();

    setAllTranscripts(prev => prev + ' ' + answerText);
    setAllWords(prev => [...prev, ...answerText.split(/\s+/).filter(Boolean)]);

    setPhase('evaluating');

    let evaluation: AnswerEvaluation;
    if (apiKey) {
      try {
        evaluation = await evaluateAnswer(apiKey, currentQuestion, answerText, config!.jobTitle);
      } catch {
        evaluation = evaluateAnswerHeuristic(currentQuestion, answerText);
      }
    } else {
      evaluation = evaluateAnswerHeuristic(currentQuestion, answerText);
    }

    setCurrentEval(evaluation);

    const answer: InterviewAnswer = {
      question: currentQuestion,
      answer: answerText,
      feedback: evaluation.feedback,
      followUp: evaluation.followUp,
    };

    setAnswers(prev => [...prev, answer]);
    setPhase('feedback');
  }, [speech, currentQuestion, apiKey, config]);

  const handleFollowUp = () => {
    setIsFollowUp(true);
    setFollowUpTranscript('');
    speech.start();
    setPhase('followup');
  };

  const submitFollowUp = useCallback(() => {
    const fuText = speech.transcript.trim();
    speech.stop();
    setFollowUpTranscript(fuText);

    setAllTranscripts(prev => prev + ' ' + fuText);
    setAllWords(prev => [...prev, ...fuText.split(/\s+/).filter(Boolean)]);

    setAnswers(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], followUpAnswer: fuText };
      }
      return updated;
    });

    moveToNext();
  }, [speech]);

  const skipFollowUp = () => {
    speech.stop();
    moveToNext();
  };

  const moveToNext = useCallback(() => {
    setCurrentEval(null);
    setIsFollowUp(false);
    setFollowUpTranscript('');

    if (currentIndex + 1 >= totalQuestions) {
      endInterview();
    } else {
      setCurrentIndex(prev => prev + 1);
      setPhase('answering');
      speech.start();
    }
  }, [currentIndex, totalQuestions]);

  const endInterview = useCallback(() => {
    timer.stop();
    speech.stop();
    eyeTracking.stopTracking();
    streamRef.current?.getTracks().forEach(t => t.stop());

    const hasEyeData = hasCamera && eyeTracking.isTracking;
    const baseResults = computeResults({
      duration: timer.seconds,
      script: '',
      transcript: allTranscripts,
      words: allWords,
      fillerWords: speech.fillerWords,
      totalFillers: speech.totalFillers,
      wpmSamples: speech.wpmSamples,
      eyeContactPercent: hasEyeData ? eyeTracking.getFinalPercent() : 0,
      hasEyeTracking: hasEyeData,
    });

    const finalAnswers = [...answers];

    const goodAnswers = finalAnswers.filter(a => a.feedback && !a.feedback.toLowerCase().includes('short') && !a.feedback.toLowerCase().includes('elaborate'));
    const interviewScore = totalQuestions > 0
      ? Math.round((goodAnswers.length / totalQuestions) * 40 + baseResults.overallScore * 0.6)
      : baseResults.overallScore;

    const interviewResults: InterviewResults = {
      ...baseResults,
      interviewAnswers: finalAnswers,
      interviewScore,
    };

    session.setInterviewAnswers(finalAnswers);
    session.setResults(interviewResults);
    navigate('/report');
  }, [timer, speech, eyeTracking, hasCamera, allTranscripts, allWords, answers, totalQuestions, session, navigate]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const getPaceInfo = (wpm: number) => {
    if (wpm === 0) return { label: 'Waiting...', color: 'text-slate-400', bg: 'bg-slate-50' };
    if (wpm < 100) return { label: 'Too Slow', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (wpm <= 150) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-50' };
    if (wpm <= 170) return { label: 'Slightly Fast', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Too Fast', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getEyeContactInfo = (percent: number) => {
    if (percent >= 75) return { label: 'Great', color: 'text-green-600', bg: 'bg-green-50' };
    if (percent >= 50) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percent >= 25) return { label: 'Low', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const paceInfo = getPaceInfo(speech.currentWPM);
  const eyeInfo = getEyeContactInfo(eyeTracking.eyeContactPercent);

  // ── SETUP PHASE ──
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Get Ready for Your Interview</h2>
            <p className="text-slate-500">
              Allow camera and microphone so you can see yourself and speak your answers naturally.
            </p>
            {config && (
              <div className="mt-4 bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                <span className="font-medium">{config.jobTitle}</span>
                {config.company && <span className="text-slate-400"> at {config.company}</span>}
                <span className="text-slate-400"> &middot; {totalQuestions} questions</span>
              </div>
            )}
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-100 mb-6 aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${hasCamera ? '' : 'hidden'}`}
            />
            {!hasCamera && (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="w-12 h-12 text-slate-300" />
              </div>
            )}
          </div>

          {permissionError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {permissionError}
            </div>
          )}

          {!hasMic ? (
            <button
              onClick={requestPermissions}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-base font-medium transition-all"
            >
              Allow Camera & Microphone
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500 justify-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Mic ready
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${hasCamera ? 'bg-green-400' : 'bg-amber-400'}`} />
                  {hasCamera ? 'Camera ready' : 'No camera'}
                </span>
              </div>
              <button
                onClick={startInterview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-base font-medium transition-all shadow-lg"
              >
                Begin Interview
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/interview/setup')}
            className="mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to setup
          </button>
        </motion.div>
      </div>
    );
  }

  // ── ACTIVE PHASES ──
  return (
    <div className="h-screen flex flex-col bg-white font-sans">
      {/* Top Bar */}
      <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-400" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-sm font-medium text-slate-600">Interview</span>
          {speech.isListening && (
            <span className="flex items-center gap-1 text-xs text-blue-500">
              <Mic className="w-3 h-3" />
              Listening
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-slate-500">
            Q {currentIndex + 1} / {totalQuestions}
          </div>
          <div className="text-xl font-mono font-semibold text-slate-800 tabular-nums">
            {timer.formatted}
          </div>
        </div>

        <button
          onClick={endInterview}
          className="h-8 px-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-1.5 hover:bg-red-100 transition-colors text-sm font-medium text-red-600"
        >
          <Square className="w-3 h-3" />
          End
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question + Answer Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Question Display */}
          <div className="px-8 md:px-16 pt-10 pb-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentIndex + (isFollowUp ? '-fu' : '')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-2xl md:text-3xl font-medium text-slate-900 leading-relaxed"
              >
                {isFollowUp && currentEval?.followUp ? currentEval.followUp : currentQuestion}
              </motion.h2>
            </AnimatePresence>
            {isFollowUp && (
              <div className="mt-2 text-xs text-indigo-500 font-medium">Follow-up question</div>
            )}
          </div>

          {/* Answer / Feedback Area */}
          <div className="flex-1 px-8 md:px-16 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* Answering State */}
              {(phase === 'answering' || phase === 'followup') && (
                <motion.div
                  key="answering"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 min-h-[120px]">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Mic className="w-3 h-3" />
                      Your answer (speak naturally)
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {speech.transcript || (
                        <span className="text-slate-400 italic">Start speaking your answer...</span>
                      )}
                    </p>
                    {speech.interimTranscript && (
                      <p className="text-slate-400 italic mt-1">{speech.interimTranscript}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={phase === 'followup' ? submitFollowUp : submitAnswer}
                      disabled={!speech.transcript.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Submit Answer
                    </button>
                    {phase === 'followup' && (
                      <button
                        onClick={skipFollowUp}
                        className="text-slate-500 hover:text-slate-700 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Evaluating State */}
              {phase === 'evaluating' && (
                <motion.div
                  key="evaluating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-12"
                >
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Reviewing your answer...</p>
                  </div>
                </motion.div>
              )}

              {/* Feedback State */}
              {phase === 'feedback' && currentEval && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className={`rounded-2xl p-6 border ${
                    currentEval.quality === 'good'
                      ? 'bg-green-50/50 border-green-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {currentEval.quality === 'good' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className={`text-sm font-semibold mb-1 ${
                          currentEval.quality === 'good' ? 'text-green-800' : 'text-amber-800'
                        }`}>
                          {currentEval.quality === 'good' ? 'Strong Answer' : 'Could Be Stronger'}
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          currentEval.quality === 'good' ? 'text-green-700' : 'text-amber-700'
                        }`}>
                          {currentEval.feedback}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {currentEval.followUp && apiKey && (
                      <button
                        onClick={handleFollowUp}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2"
                      >
                        Answer Follow-Up
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={moveToNext}
                      className={`px-5 py-3 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2 ${
                        currentEval.followUp && apiKey
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {currentIndex + 1 >= totalQuestions ? 'Finish Interview' : 'Next Question'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Webcam Preview */}
          <AnimatePresence>
            {hasCamera && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-6 left-6 z-20"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-56 h-40 object-cover mirror-video"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent flex items-end px-3 pb-1.5">
                    <div className="flex items-center gap-2 w-full">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        eyeTracking.isTracking
                          ? eyeTracking.isLookingAtCamera ? 'bg-green-400' : 'bg-amber-400'
                          : 'bg-slate-400'
                      }`} />
                      <span className="text-[10px] font-medium text-white/80">
                        {eyeTracking.isTracking
                          ? eyeTracking.isLookingAtCamera ? 'Good eye contact' : 'Look at camera'
                          : 'Camera active'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar at bottom */}
          <div className="h-1.5 bg-slate-100 shrink-0">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${((currentIndex + (phase === 'feedback' || phase === 'evaluating' ? 1 : 0.5)) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: Live HUD */}
        <div className="w-72 md:w-80 border-l border-slate-200 bg-slate-50 p-5 flex flex-col gap-4 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
              <Timer className="w-4 h-4 text-slate-400" />
              Session
            </div>
            <div className="text-lg font-mono font-semibold text-slate-800 tabular-nums">
              {timer.formatted}
            </div>
          </div>

          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Metrics</h3>

          {/* Eye Contact */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Eye className="w-4 h-4 text-blue-500" />
                Eye Contact
              </div>
              {eyeTracking.isTracking ? (
                <span className={`text-xs font-bold ${eyeInfo.color} ${eyeInfo.bg} px-2 py-1 rounded-md`}>
                  {eyeInfo.label}
                </span>
              ) : eyeTracking.error ? (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                  Error
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  {eyeTracking.isLoading ? 'Loading...' : hasCamera ? 'Starting...' : 'No Camera'}
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${eyeTracking.eyeContactPercent}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500 text-right">
              {eyeTracking.error
                ? <span className="text-red-500">{eyeTracking.error}</span>
                : eyeTracking.isTracking
                  ? `${eyeTracking.eyeContactPercent}% looking at camera`
                  : 'Tracking gaze...'}
            </div>
          </div>

          {/* Speech Pace */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Activity className="w-4 h-4 text-amber-500" />
                Speech Pace
              </div>
              <span className={`text-xs font-bold ${paceInfo.color} ${paceInfo.bg} px-2 py-1 rounded-md`}>
                {paceInfo.label}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-semibold text-slate-800 tabular-nums">{speech.currentWPM}</span>
              <span className="text-xs text-slate-500 mb-1">wpm</span>
            </div>
          </div>

          {/* Filler Words */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MessageSquareWarning className="w-4 h-4 text-red-500" />
                Filler Words
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                {speech.totalFillers}
              </span>
            </div>
            {Object.keys(speech.fillerWords).length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(speech.fillerWords) as [string, number][])
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([word, count]) => (
                    <span
                      key={word}
                      className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 font-medium border border-red-100"
                    >
                      {word} ({count})
                    </span>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No fillers yet</p>
            )}
          </div>

          {/* Answered Questions */}
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-2">Progress</h3>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div
                key={i}
                className={`text-xs rounded-lg p-2.5 border transition-colors ${
                  i === currentIndex
                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                    : i < currentIndex
                      ? 'bg-green-50/50 border-green-100 text-green-700'
                      : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <span className="font-bold mr-1.5">Q{i + 1}</span>
                {q.length > 50 ? q.slice(0, 50) + '...' : q}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
