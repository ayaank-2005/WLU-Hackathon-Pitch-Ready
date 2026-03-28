import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, FileText, Minus, Plus, Gauge } from 'lucide-react';
import { useSession } from '../context/SessionContext';

const TEMPLATES = [
  {
    name: "Business Pitch",
    text: "Good morning everyone. Today I want to talk about an opportunity that could transform how we approach our market.\n\nOver the past six months, our team has identified a significant gap in the student tools space. Current solutions focus heavily on content creation but ignore delivery quality entirely.\n\nOur proposal is simple: build a platform that helps students practice and improve their speaking skills before it counts. The market opportunity is substantial — over 20 million university students give graded presentations each year.\n\nLet me walk you through our three key differentiators, our go-to-market strategy, and the financial projections that make this a compelling investment."
  },
  {
    name: "Project Update",
    text: "Thank you for being here. I'm excited to share our progress on the project.\n\nWe've completed the first phase of development and the results have exceeded our initial expectations. The core platform is now functional with three major features deployed.\n\nIn terms of metrics, we've seen a 40% improvement in user engagement since the last update. Our test group reported significantly higher satisfaction scores.\n\nFor the next phase, we're focusing on scalability and user feedback integration. I'll walk you through the timeline and resource requirements for each milestone."
  },
  {
    name: "Interview Intro",
    text: "Hi, my name is [Your Name] and I'm currently studying [Your Major] at [Your University].\n\nI'm particularly interested in this role because it combines my passion for technology with my experience in project management. During my last internship, I led a team of four developers to deliver a web application that reduced manual data entry by 60%.\n\nI'm a strong communicator who thrives in collaborative environments. I believe my technical skills and leadership experience make me a great fit for this position.\n\nI'd love to tell you more about my background and hear about the team I'd be joining."
  },
  {
    name: "Thesis Defense",
    text: "Good afternoon, committee members. Thank you for your time today.\n\nMy thesis examines the relationship between digital literacy and academic performance among undergraduate students. Over the past year, I've conducted a mixed-methods study involving 300 participants across three universities.\n\nThe key findings reveal a statistically significant correlation between structured digital tool usage and improved presentation outcomes. Students who practiced with feedback tools showed a 25% improvement in delivery scores.\n\nI'll begin by reviewing the literature that motivated this research, then walk through my methodology, present the findings, and discuss their implications for educational technology design."
  }
];

const SPEED_LABELS = ['Slow', 'Medium', 'Fast'];

export default function Setup() {
  const navigate = useNavigate();
  const session = useSession();
  const [localScript, setLocalScript] = useState(session.script);
  const [localFontSize, setLocalFontSize] = useState(session.fontSize);
  const [localSpeed, setLocalSpeed] = useState(session.scrollSpeed);

  const wordCount = localScript.trim() ? localScript.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.max(1, Math.round(wordCount / 130));

  const handleStart = () => {
    if (!localScript.trim()) return;
    session.setScript(localScript);
    session.setFontSize(localFontSize);
    session.setScrollSpeed(localSpeed);
    session.clearResults();
    navigate('/session');
  };

  const applyTemplate = (text: string) => {
    setLocalScript(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight">Pitch Ready.</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
              Prepare Your Rehearsal
            </h1>
            <p className="text-lg text-slate-500">
              Paste your script, choose your settings, and start practicing.
            </p>
          </div>

          {/* Script Input */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText className="w-4 h-4 text-blue-500" />
                Your Script
              </div>
              {wordCount > 0 && (
                <div className="text-xs text-slate-400">
                  {wordCount} words &middot; ~{estimatedMinutes} min
                </div>
              )}
            </div>
            <textarea
              value={localScript}
              onChange={(e) => setLocalScript(e.target.value)}
              placeholder="Paste your presentation script or speaking notes here..."
              className="w-full h-56 resize-none rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all leading-relaxed"
            />
          </div>

          {/* Templates */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-slate-500 mb-3">Or start with a template</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TEMPLATES.map((template, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(template.text)}
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-sm font-medium text-slate-700 transition-all text-left"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-10">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
              Teleprompter Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                  Font Size
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setLocalFontSize(Math.max(20, localFontSize - 4))}
                    className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-500" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-semibold text-slate-800">{localFontSize}</span>
                    <span className="text-sm text-slate-400 ml-1">px</span>
                  </div>
                  <button
                    onClick={() => setLocalFontSize(Math.min(56, localFontSize + 4))}
                    className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Scroll Speed */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                  <Gauge className="w-4 h-4 inline mr-1.5 text-slate-400" />
                  Scroll Speed
                </label>
                <div className="flex gap-2">
                  {SPEED_LABELS.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setLocalSpeed(i + 1)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        localSpeed === i + 1
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStart}
              disabled={!localScript.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 disabled:shadow-none disabled:hover:translate-y-0 inline-flex items-center gap-2"
            >
              Start Rehearsal
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-sm text-slate-400">
              You&apos;ll be asked to allow camera &amp; microphone access.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
