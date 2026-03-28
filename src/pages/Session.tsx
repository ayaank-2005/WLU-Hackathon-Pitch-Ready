import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Timer, Eye, Activity, MessageSquareWarning, Mic,
  Video, VideoOff, Square, Pause, Play as PlayIcon,
  Minus, Plus, ArrowLeft, AlertCircle
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useEyeTracking } from '../hooks/useEyeTracking';
import { useTimer } from '../hooks/useTimer';
import { computeResults } from '../lib/analytics';

type Phase = 'setup' | 'active';

export default function Session() {
  const navigate = useNavigate();
  const session = useSession();
  const timer = useTimer();
  const speech = useSpeechRecognition();
  const eyeTracking = useEyeTracking();

  const [phase, setPhase] = useState<Phase>('setup');
  const [hasCamera, setHasCamera] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [localFontSize, setLocalFontSize] = useState(session.fontSize);
  const [isPaused, setIsPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const teleprompterRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isPausedRef = useRef(false);
  const scrollAccumRef = useRef(0);

  useEffect(() => {
    if (!session.script) navigate('/setup');
  }, [session.script, navigate]);

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

  const startAutoScroll = useCallback(() => {
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
    }
    scrollAccumRef.current = 0;

    const pxPerFrame = [0.4, 0.8, 1.5][(session.scrollSpeed || 2) - 1] || 0.8;

    const scroll = () => {
      if (teleprompterRef.current && !isPausedRef.current) {
        scrollAccumRef.current += pxPerFrame;
        if (scrollAccumRef.current >= 1) {
          const whole = Math.floor(scrollAccumRef.current);
          teleprompterRef.current.scrollTop += whole;
          scrollAccumRef.current -= whole;
        }
      }
      scrollAnimRef.current = requestAnimationFrame(scroll);
    };
    scrollAnimRef.current = requestAnimationFrame(scroll);
  }, [session.scrollSpeed]);

  const startSession = async () => {
    setPhase('active');
  };

  const togglePause = () => {
    if (isPaused) {
      timer.resume();
      isPausedRef.current = false;
      setIsPaused(false);
    } else {
      timer.pause();
      isPausedRef.current = true;
      setIsPaused(true);
    }
  };

  const endSession = useCallback(() => {
    timer.stop();
    speech.stop();
    eyeTracking.stopTracking();

    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }

    streamRef.current?.getTracks().forEach(t => t.stop());

    const hasEyeData = hasCamera && eyeTracking.isTracking;
    const results = computeResults({
      duration: timer.seconds,
      script: session.script,
      transcript: speech.transcript,
      words: speech.words,
      fillerWords: speech.fillerWords,
      totalFillers: speech.totalFillers,
      wpmSamples: speech.wpmSamples,
      eyeContactPercent: hasEyeData ? eyeTracking.getFinalPercent() : 0,
      hasEyeTracking: hasEyeData,
    });

    session.setResults(results);
    navigate('/report');
  }, [timer, speech, eyeTracking, hasCamera, session, navigate]);

  useEffect(() => {
    if (phase !== 'active') return;

    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }

    timer.start();
    speech.start();

    if (hasCamera && streamRef.current) {
      eyeTracking.startTracking(streamRef.current);
    }

    startAutoScroll();

    return () => {
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    };
  }, []);

  const getPaceInfo = (wpm: number) => {
    if (wpm === 0) return { label: 'Waiting...', color: 'text-slate-400', bg: 'bg-slate-50', barColor: 'bg-slate-200' };
    if (wpm < 100) return { label: 'Too Slow', color: 'text-blue-600', bg: 'bg-blue-50', barColor: 'bg-blue-400' };
    if (wpm <= 150) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-50', barColor: 'bg-green-400' };
    if (wpm <= 170) return { label: 'Slightly Fast', color: 'text-amber-600', bg: 'bg-amber-50', barColor: 'bg-amber-400' };
    return { label: 'Too Fast', color: 'text-red-600', bg: 'bg-red-50', barColor: 'bg-red-400' };
  };

  const getEyeContactInfo = (percent: number) => {
    if (percent >= 75) return { label: 'Great', color: 'text-green-600', bg: 'bg-green-50' };
    if (percent >= 50) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percent >= 25) return { label: 'Low', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const paceInfo = getPaceInfo(speech.currentWPM);
  const eyeInfo = getEyeContactInfo(eyeTracking.eyeContactPercent);

  const recentWPM = speech.wpmSamples.slice(-8);
  while (recentWPM.length < 8) recentWPM.unshift({ time: 0, wpm: 0 });

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
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Get Ready</h2>
            <p className="text-slate-500">
              Allow camera and microphone so you can see yourself while practicing and get live AI feedback.
            </p>
          </div>

          {/* Camera Preview */}
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
              {!hasCamera && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  Eye tracking requires camera access. Speech analytics will still work.
                </p>
              )}
              <button
                onClick={startSession}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-base font-medium transition-all shadow-lg"
              >
                Start Rehearsal
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/setup')}
            className="mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to setup
          </button>
        </motion.div>
      </div>
    );
  }

  // ── ACTIVE PHASE ──
  return (
    <div className="h-screen flex flex-col bg-white font-sans">
      {/* Top Bar */}
      <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPaused ? 'bg-amber-400' : 'bg-red-400'}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isPaused ? 'bg-amber-500' : 'bg-red-500'}`} />
          </span>
          <span className="text-sm font-medium text-slate-600">
            {isPaused ? 'Paused' : 'Recording'}
          </span>
          {speech.isListening && (
            <span className="flex items-center gap-1 text-xs text-blue-500">
              <Mic className="w-3 h-3" />
              Listening
            </span>
          )}
        </div>

        <div className="text-xl font-mono font-semibold text-slate-800 tabular-nums">
          {timer.formatted}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocalFontSize(f => Math.max(20, f - 4))}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Decrease font size"
          >
            <Minus className="w-3 h-3 text-slate-500" />
          </button>
          <button
            onClick={() => setLocalFontSize(f => Math.min(56, f + 4))}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Increase font size"
          >
            <Plus className="w-3 h-3 text-slate-500" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button
            onClick={togglePause}
            className="h-8 px-3 rounded-lg border border-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600"
          >
            {isPaused ? <PlayIcon className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={endSession}
            className="h-8 px-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-1.5 hover:bg-red-100 transition-colors text-sm font-medium text-red-600"
          >
            <Square className="w-3 h-3" />
            End
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Teleprompter */}
        <div className="flex-1 relative">
          {/* Gradient mask overlay */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, transparent 12%, transparent 88%, rgba(255,255,255,0.95) 100%)'
            }}
          />

          <div
            ref={teleprompterRef}
            className="h-full overflow-y-auto px-8 md:px-16 py-24 hide-scrollbar"
          >
            <div className="max-w-3xl mx-auto">
              <p
                style={{ fontSize: `${localFontSize}px`, lineHeight: 1.6 }}
                className="font-medium text-slate-700 whitespace-pre-wrap"
              >
                {session.script}
              </p>
              {/* Extra space at bottom so user can scroll past the end */}
              <div className="h-[60vh]" />
            </div>
          </div>

          {/* Webcam Preview — large so the user can see themselves */}
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
                    className="w-64 h-48 object-cover mirror-video"
                  />
                  {/* Eye contact indicator bar */}
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

          {/* Live transcript overlay */}
          {speech.interimTranscript && (
            <div className="absolute bottom-6 left-[17.5rem] right-4 z-20">
              <div className="bg-slate-900/80 backdrop-blur-sm text-white/80 text-sm rounded-lg px-4 py-2 truncate">
                {speech.interimTranscript}
              </div>
            </div>
          )}
        </div>

        {/* Live HUD */}
        <div className="w-72 md:w-80 border-l border-slate-200 bg-slate-50 p-5 flex flex-col gap-4 overflow-y-auto shrink-0">
          {/* Timer Card */}
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
            <div className="mt-3 flex gap-1 h-8 items-end">
              {recentWPM.map((sample, i) => {
                const maxWPM = 200;
                const height = Math.max(4, Math.min(100, (sample.wpm / maxWPM) * 100));
                const isLatest = i === recentWPM.length - 1;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-500 ${isLatest ? paceInfo.barColor : 'bg-slate-200'}`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
              <span>Ideal: 120-150</span>
              <span>{speech.words.length} words</span>
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
                {speech.totalFillers} Detected
              </span>
            </div>
            {Object.keys(speech.fillerWords).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(Object.entries(speech.fillerWords) as [string, number][])
                  .sort((a, b) => b[1] - a[1])
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
              <p className="text-xs text-slate-400">No filler words yet. Keep going!</p>
            )}
          </div>

          {/* Browser support warning */}
          {!speech.isSupported && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
              Speech recognition requires Chrome or Edge browser.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
