import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  ArrowLeft, RotateCcw, Eye, Activity, MessageSquareWarning, Trophy,
  TrendingUp, TrendingDown, Minus as MinusIcon, Lightbulb, Clock, FileText
} from 'lucide-react';
import { useSession } from '../context/SessionContext';

function ScoreCircle({ score, label, color, size = 100 }: {
  score: number; label: string; color: string; size?: number;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle
          cx={center} cy={center} r={radius} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
        <text x={center} y={center} textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={size * 0.28} fontWeight="700">
          {score}
        </text>
      </svg>
      <span className="text-sm font-medium text-slate-600 mt-1">{label}</span>
    </div>
  );
}

function DeltaBadge({ current, previous, suffix = '', invert = false }: {
  current: number; previous: number; suffix?: string; invert?: boolean;
}) {
  const diff = current - previous;
  const isPositive = invert ? diff < 0 : diff > 0;
  const isNeutral = diff === 0;

  if (isNeutral) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
      <MinusIcon className="w-3 h-3" /> No change
    </span>
  );

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(diff)}{suffix} {isPositive ? 'better' : 'worse'}
    </span>
  );
}

export default function Report() {
  const navigate = useNavigate();
  const { results, previousResults } = useSession();

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No session data found.</p>
          <button
            onClick={() => navigate('/setup')}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium"
          >
            Start a Session
          </button>
        </div>
      </div>
    );
  }

  const formatDuration = (secs: number) =>
    `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  const scoreColor = (s: number) =>
    s >= 75 ? '#22c55e' : s >= 50 ? '#3b82f6' : s >= 25 ? '#f59e0b' : '#ef4444';

  const fillerEntries: [string, number][] = Object.entries(results.fillerWords)
    .map(([k, v]) => [k, v as number] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  const chartData = results.wpmSamples.map(s => ({
    time: formatDuration(Math.round(s.time)),
    wpm: s.wpm,
  }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight">Pitch Ready.</span>
          </div>
          <button
            onClick={() => navigate('/setup')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              Session Complete
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">
              Your Rehearsal Report
            </h1>
            <p className="text-slate-500 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatDuration(results.duration)}</span>
              <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {results.transcript.split(/\s+/).filter(Boolean).length} words spoken</span>
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center"
            >
              <ScoreCircle score={results.overallScore} label="Overall" color={scoreColor(results.overallScore)} />
              {previousResults && (
                <div className="mt-3">
                  <DeltaBadge current={results.overallScore} previous={previousResults.overallScore} suffix="pts" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center"
            >
              <ScoreCircle
                score={results.hasEyeTracking ? results.eyeContactScore : 0}
                label="Eye Contact"
                color={results.hasEyeTracking ? scoreColor(results.eyeContactScore) : '#94a3b8'}
              />
              {results.hasEyeTracking && previousResults?.hasEyeTracking && (
                <div className="mt-3">
                  <DeltaBadge current={results.eyeContactScore} previous={previousResults.eyeContactScore} suffix="%" />
                </div>
              )}
              {!results.hasEyeTracking && (
                <span className="mt-3 text-xs text-slate-400">Camera not used</span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center"
            >
              <ScoreCircle score={results.paceScore} label="Pace" color={scoreColor(results.paceScore)} />
              {previousResults && (
                <div className="mt-3">
                  <DeltaBadge current={results.paceScore} previous={previousResults.paceScore} suffix="pts" />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center"
            >
              <ScoreCircle score={results.fillerScore} label="Filler Words" color={scoreColor(results.fillerScore)} />
              {previousResults && (
                <div className="mt-3">
                  <DeltaBadge current={results.fillerScore} previous={previousResults.fillerScore} suffix="pts" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Charts & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* WPM Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                Speaking Pace Over Time
              </h3>
              <p className="text-xs text-slate-400 mb-4">Average: {results.averageWPM} WPM &middot; Ideal: 120-150 WPM</p>

              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <YAxis domain={[0, 'auto']} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 13 }}
                    />
                    <ReferenceLine y={120} stroke="#94a3b8" strokeDasharray="3 3" />
                    <ReferenceLine y={150} stroke="#94a3b8" strokeDasharray="3 3" />
                    <Line
                      type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2}
                      dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
                  Not enough data for chart. Try speaking longer next time.
                </div>
              )}
            </div>

            {/* Filler Words Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-red-500" />
                Filler Word Breakdown
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {results.totalFillers} total filler{results.totalFillers !== 1 ? 's' : ''} detected
                {previousResults && (
                  <> &middot; <DeltaBadge current={results.totalFillers} previous={previousResults.totalFillers} invert /></>
                )}
              </p>

              {fillerEntries.length > 0 ? (
                <div className="space-y-3">
                  {fillerEntries.map(([word, count]: [string, number]) => {
                    const max = fillerEntries[0][1] as number;
                    const percent = max > 0 ? (Number(count) / max) * 100 : 0;
                    return (
                      <div key={word}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700">&ldquo;{word}&rdquo;</span>
                          <span className="text-slate-500">{count} time{Number(count) > 1 ? 's' : ''}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-400 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[160px] text-slate-400">
                  <Trophy className="w-8 h-8 mb-2 text-green-400" />
                  <p className="text-sm font-medium text-green-600">No filler words detected!</p>
                  <p className="text-xs">Impressive. Clean speech throughout.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-10">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Personalized Tips
            </h3>
            <div className="space-y-4">
              {results.tips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-slate-600 leading-relaxed pt-0.5">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript */}
          {results.transcript.trim() && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-10">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Session Transcript
              </h3>
              <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-600 leading-relaxed max-h-64 overflow-y-auto">
                {results.transcript || 'No speech was captured during this session.'}
              </div>
            </div>
          )}

          {/* Comparison Section */}
          {previousResults && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/60 p-6 mb-10">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Compared to Previous Attempt
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Overall</p>
                  <DeltaBadge current={results.overallScore} previous={previousResults.overallScore} suffix="pts" />
                </div>
                {results.hasEyeTracking && previousResults.hasEyeTracking && (
                  <div className="bg-white/80 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">Eye Contact</p>
                    <DeltaBadge current={results.eyeContactScore} previous={previousResults.eyeContactScore} suffix="%" />
                  </div>
                )}
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Pace</p>
                  <DeltaBadge current={results.paceScore} previous={previousResults.paceScore} suffix="pts" />
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Fillers</p>
                  <DeltaBadge current={results.totalFillers} previous={previousResults.totalFillers} invert />
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center pb-10">
            <button
              onClick={() => navigate('/setup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Practice Again
            </button>
            <p className="mt-4 text-sm text-slate-400">
              Each attempt is compared against the previous session.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
