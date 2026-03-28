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
    <div className="min-h-screen text-slate-900 font-sans relative">
      {/* Soft Cloud Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Overlay to soften the clouds */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white/90"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/40 backdrop-blur-md border-b border-white/60 sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight">Pitch Ready.</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight">
              What are you practicing for?
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Choose your practice mode. Both include real-time AI feedback on eye contact, pacing, and delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Presentation Card */}
            <motion.button
              onClick={selectPresentation}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative text-left bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100/50 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:border-blue-200 transition-all duration-300">
                  <Monitor className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>

                <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
                  Presentation Mode
                </h2>
                <p className="text-slate-500 leading-relaxed mb-8 flex-1">
                  Practice your pitch, class presentation, or thesis defense with a smart teleprompter and live delivery feedback.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: FileText, text: "Auto-scrolling teleprompter" },
                    { icon: Eye, text: "Live eye contact tracking" },
                    { icon: Activity, text: "Pace & rhythm analysis" },
                    { icon: MessageSquareWarning, text: "Filler word detection" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/80 border border-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                  Start Practicing
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>

            {/* Interview Card */}
            <motion.button
              onClick={selectInterview}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative text-left bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none"></div>
              
              <div className="absolute top-6 right-6 bg-indigo-500/10 backdrop-blur-md text-indigo-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-indigo-200/50 z-20">
                AI-Powered
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100/50 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:border-indigo-200 transition-all duration-300">
                  <Users className="w-8 h-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                </div>

                <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
                  Interview Mode
                </h2>
                <p className="text-slate-500 leading-relaxed mb-8 flex-1">
                  Simulate a real interview with AI-generated questions tailored to your role and job description.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: Sparkles, text: "AI question generation from JD" },
                    { icon: Mic, text: "Speak your answers naturally" },
                    { icon: Eye, text: "Eye contact & delivery tracking" },
                    { icon: Sparkles, text: "Per-answer AI feedback" },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/80 border border-slate-100 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                  Start Mock Interview
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
