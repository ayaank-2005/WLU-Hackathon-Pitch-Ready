import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, MessageCircle, Eye, Activity, Brain, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const TIPS = [
  {
    icon: MessageCircle,
    title: 'Use the STAR Method',
    description: 'Structure behavioral answers with Situation, Task, Action, and Result. This keeps your responses focused and shows concrete impact.',
    example: '"At my internship (S), I was tasked with reducing page load time (T). I profiled the app and implemented lazy loading (A), cutting load time by 40% (R)."',
  },
  {
    icon: Eye,
    title: 'Maintain Eye Contact',
    description: 'Look directly at the camera (or interviewer) for at least 60% of the time. Breaking eye contact to think is natural, but always return your gaze.',
    example: 'Practice with Pitch Ready\'s eye tracking to build the habit before your real interview.',
  },
  {
    icon: Activity,
    title: 'Control Your Pace',
    description: 'Aim for 120–150 words per minute. Speaking too fast signals nervousness; too slow can lose engagement. Pause deliberately between key points.',
    example: 'Use strategic pauses after important statements to let them land with impact.',
  },
  {
    icon: Brain,
    title: 'Eliminate Filler Words',
    description: 'Replace "um," "uh," and "like" with brief pauses. Silence sounds far more confident and polished than filler words.',
    example: 'Record yourself answering a question, then count your fillers. Most people are surprised by how many they use.',
  },
  {
    icon: Users,
    title: 'Research the Company',
    description: 'Mention specific products, values, or recent news about the company. This shows genuine interest and helps you tailor answers to their culture.',
    example: '"I noticed your team recently launched X — I\'d love to contribute to initiatives like that because..."',
  },
  {
    icon: CheckCircle2,
    title: 'Prepare Questions to Ask',
    description: 'Always have 2–3 thoughtful questions ready. Ask about team dynamics, growth opportunities, or current challenges — not things easily found online.',
    example: '"What does the first 90 days look like for someone in this role?" shows you\'re thinking long-term.',
  },
  {
    icon: Lightbulb,
    title: 'Quantify Your Impact',
    description: 'Whenever possible, use numbers. "Improved performance" is vague — "reduced API response time by 35%" is memorable and credible.',
    example: 'Even estimates work: "managed a team of about 5" is better than "managed a team."',
  },
];

export default function InterviewTips() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-slate-900 font-sans relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white/95" />
      </div>

      <header className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-white/60 sticky top-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">P</div>
            <span className="font-semibold text-lg tracking-tight">Pitch Ready.</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-3 tracking-tight">Interview Tips</h1>
            <p className="text-slate-500 max-w-lg mx-auto">Proven strategies to help you ace your next interview, from delivery to content.</p>
          </div>

          <div className="space-y-6">
            {TIPS.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <tip.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{tip.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-3">{tip.description}</p>
                    <div className="bg-slate-50/80 rounded-xl px-4 py-3 text-sm text-slate-500 italic border border-slate-100">
                      {tip.example}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/mode')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Start Practicing
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
