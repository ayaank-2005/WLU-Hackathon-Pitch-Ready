import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Monitor, Users, ArrowLeft, ArrowRight, Eye, Activity, MessageSquareWarning, Sparkles, FileText, Mic } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function ModeSelect() {
  const navigate = useNavigate();
  const session = useSession();

  const selectPresentation = () => {
    session.setMode('presentation');
    navigate('/setup');
  };

  const selectInterview = () => {
    session.setMode('interview');
    navigate('/interview/setup');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
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
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
              What are you practicing for?
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Choose your practice mode. Both include real-time AI feedback on eye contact, pacing, and delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Presentation Card */}
            <motion.button
              onClick={selectPresentation}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>

              <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                Presentation Mode
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Practice your pitch, class presentation, or thesis defense with a smart teleprompter and live delivery feedback.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { icon: FileText, text: "Auto-scrolling teleprompter" },
                  { icon: Eye, text: "Live eye contact tracking" },
                  { icon: Activity, text: "Pace & rhythm analysis" },
                  { icon: MessageSquareWarning, text: "Filler word detection" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                    <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                Start Practicing
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Interview Card */}
            <motion.button
              onClick={selectInterview}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-100">
                AI-Powered
              </div>

              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>

              <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                Interview Mode
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Simulate a real interview with AI-generated questions tailored to your role and job description.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { icon: Sparkles, text: "AI question generation from JD" },
                  { icon: Mic, text: "Speak your answers naturally" },
                  { icon: Eye, text: "Eye contact & delivery tracking" },
                  { icon: Sparkles, text: "Per-answer AI feedback" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm group-hover:gap-3 transition-all">
                Start Mock Interview
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
