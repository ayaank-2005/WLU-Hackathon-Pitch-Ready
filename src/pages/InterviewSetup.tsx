import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Briefcase, Building2, FileText,
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

  const [step, setStep] = useState(1);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [roleType, setRoleType] = useState<RoleType>('general');
  const [jobDescription, setJobDescription] = useState('');
  const [questionCount, setQuestionCount] = useState(8);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const canProceedStep1 = jobTitle.trim().length > 0;
  const canGenerate = canProceedStep1;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      let questions: string[];

      if (apiKey.trim()) {
        questions = await generateQuestions(apiKey.trim(), jobTitle, jobDescription, questionCount);
      } else {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/mode')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 1 ? 'Back' : 'Choose Mode'}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight">Pitch Ready.</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-2 py-3">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${s <= step ? 'bg-blue-600' : 'bg-transparent'}`}
                  style={{ width: s < step ? '100%' : s === step ? '50%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* Step 1: Job Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold text-slate-900 mb-3">Tell us about the role</h1>
                <p className="text-slate-500">We'll tailor your interview questions to match the position.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      <Briefcase className="w-4 h-4 inline mr-2 text-blue-500" />
                      Job Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Software Engineering Intern, Product Manager"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
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
                      placeholder="e.g. Google, Shopify, TD Bank"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Role Category
                    </label>
                    <div className="relative">
                      <select
                        value={roleType}
                        onChange={e => setRoleType(e.target.value as RoleType)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
                      >
                        {ROLE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full text-base font-medium transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold text-slate-900 mb-3">Paste the job description</h1>
                <p className="text-slate-500">This helps generate more relevant, targeted questions. You can skip this step.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Job Description
                    </div>
                    {jobDescription.trim() && (
                      <span className="text-xs text-slate-400">
                        {jobDescription.trim().split(/\s+/).length} words
                      </span>
                    )}
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the full job posting here... (optional but recommended for AI-generated questions)"
                    className="w-full h-64 resize-none rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all leading-relaxed"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
                  >
                    Skip this step
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-base font-medium transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold text-slate-900 mb-3">Almost ready</h1>
                <p className="text-slate-500">Choose your interview length and optionally connect AI for smarter questions.</p>
              </div>

              <div className="space-y-6">
                {/* Question Count */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <label className="text-sm font-medium text-slate-700 mb-4 block">
                    <Clock className="w-4 h-4 inline mr-2 text-blue-500" />
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {QUESTION_COUNTS.map(count => (
                      <button
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={`py-4 rounded-xl text-center transition-all border-2 ${
                          questionCount === count
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
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

                {/* API Key (Optional) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Key className="w-4 h-4 text-amber-500" />
                      OpenAI API Key
                      <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showApiKey ? 'rotate-180' : ''}`} />
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
                          Add your OpenAI key for AI-generated questions tailored to your job description. Without it, questions come from our built-in bank. Your key is never stored.
                        </p>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={e => setApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="bg-slate-100/60 rounded-2xl p-5 border border-slate-200/50">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Interview Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-500">Role:</span> <span className="font-medium text-slate-800">{jobTitle || '—'}</span></div>
                    {company && <div><span className="text-slate-500">Company:</span> <span className="font-medium text-slate-800">{company}</span></div>}
                    <div><span className="text-slate-500">Questions:</span> <span className="font-medium text-slate-800">{questionCount}</span></div>
                    <div><span className="text-slate-500">AI:</span> <span className="font-medium text-slate-800">{apiKey.trim() ? 'OpenAI Connected' : 'Built-in Bank'}</span></div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 disabled:shadow-none disabled:hover:translate-y-0 inline-flex items-center gap-3"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
