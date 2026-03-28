import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Briefcase, Building2, FileText,
  Sparkles, Loader2, ChevronDown, Clock, Key, AlertCircle
} from 'lucide-react';
import { useSession, type RoleType } from '../context/SessionContext';
import { selectQuestions } from '../lib/questions';
import { generateQuestions } from '../lib/openai';

const ROLE_OPTIONS: { value: RoleType; label: string }[] = [
  { value: 'software_engineering', label: 'Software Engineering' },
  { value: 'product_management', label: 'Product Management' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'design', label: 'Design / UX' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'general', label: 'General / Other' },
];

const QUESTION_COUNTS = [5, 8, 12];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const session = useSession();

  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [roleType, setRoleType] = useState<RoleType>('general');
  const [jobDescription, setJobDescription] = useState('');
  const [questionCount, setQuestionCount] = useState(8);
  const [apiKey, setApiKey] = useState('');
  const [showJD, setShowJD] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const canGenerate = jobTitle.trim().length > 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      let questions: string[];

      try {
        questions = await generateQuestions(apiKey.trim(), jobTitle, jobDescription, questionCount);
      } catch {
        questions = selectQuestions(roleType, questionCount);
      }

      session.setInterviewConfig({
        jobTitle,
        company,
        roleType,
        jobDescription,
        questionCount,
        apiKey: apiKey.trim() || undefined,
      });
      session.setInterviewQuestions(questions);
      session.setInterviewAnswers([]);
      session.clearResults();
      navigate('/interview/session');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions. Try without an API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans relative">
      {/* Cloud Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white/90" />
      </div>

      <header className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-white/60 sticky top-0">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/mode')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Choose Mode
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight">Pitch Ready.</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Hero */}
          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-3 tracking-tight">
              Set Up Your Interview
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto">
              Tell us about the role and we'll generate tailored questions. Only the job title is required — everything else is optional.
            </p>
          </div>

          {/* Primary Fields */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  <Briefcase className="w-4 h-4 inline mr-2 text-blue-500" />
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full rounded-xl border border-white bg-white/50 px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  <Building2 className="w-4 h-4 inline mr-2 text-slate-400" />
                  Company <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Google, Shopify"
                  className="w-full rounded-xl border border-white bg-white/50 px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Role Type Pills */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <label className="text-sm font-medium text-slate-700 mb-4 block">
              Role Category
            </label>
            <div className="flex flex-wrap gap-2.5">
              {ROLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRoleType(opt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    roleType === opt.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white/60 border border-white text-slate-600 hover:bg-white hover:border-blue-200 shadow-sm'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Length */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <label className="text-sm font-medium text-slate-700 mb-4 block">
              <Clock className="w-4 h-4 inline mr-2 text-blue-500" />
              Interview Length
            </label>
            <div className="grid grid-cols-3 gap-3">
              {QUESTION_COUNTS.map(count => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-4 rounded-xl text-center transition-all border-2 ${
                    questionCount === count
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white/50 border-white text-slate-600 shadow-sm hover:border-blue-200 hover:bg-white'
                  }`}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    ~{Math.round(count * 2.5)} min
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible: Job Description */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <button
              onClick={() => setShowJD(!showJD)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="w-4 h-4 text-blue-500" />
                Paste a Job Description
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showJD ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showJD && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-slate-500 mt-3 mb-3">
                    Helps generate more targeted, role-specific questions with AI.
                  </p>
                  <div className="relative">
                    <textarea
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder="Paste the full job posting here..."
                      className="w-full h-48 resize-none rounded-xl border border-white bg-white/50 px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all leading-relaxed shadow-sm"
                    />
                    {jobDescription.trim() && (
                      <span className="absolute bottom-3 right-4 text-xs text-slate-400">
                        {jobDescription.trim().split(/\s+/).length} words
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapsible: API Key */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Key className="w-4 h-4 text-amber-500" />
                Connect Groq API
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showApiKey ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showApiKey && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-slate-500 mt-3 mb-3">
                    AI features work by default. To use your own Groq API key, paste it here.{' '}
                    <Link to="/tutorial/groq" className="text-blue-500 hover:text-blue-600 underline">
                      How to get a key
                    </Link>
                  </p>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full rounded-xl border border-white bg-white/50 px-4 py-3 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Start Button */}
          <div className="flex justify-center pt-4 pb-6">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-12 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 disabled:shadow-none disabled:hover:translate-y-0 inline-flex items-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start Interview
                </>
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
