import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Zap, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-3 tracking-tight">About Pitch Ready</h1>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              We believe everyone deserves to feel confident when they speak. Pitch Ready is a browser-based rehearsal platform that gives students real-time feedback on their delivery — so they can walk into any presentation or interview prepared.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Our Story</h2>
            <div className="text-slate-600 leading-relaxed space-y-4">
              <p>
                Pitch Ready started as a hackathon project at Wilfrid Laurier University. We noticed that students spend hours preparing slide decks but rarely practice their actual delivery — the pacing, eye contact, and verbal clarity that make or break a presentation.
              </p>
              <p>
                We built a tool that combines a smart teleprompter with real-time AI analysis. Using your webcam and microphone, Pitch Ready tracks your eye contact, measures your speaking pace, catches filler words, and scores how closely you follow your script — all in the browser, with nothing to install.
              </p>
              <p>
                Whether you're rehearsing a thesis defense, preparing for a job interview, or polishing a startup pitch, Pitch Ready helps you improve with every run.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: 'Mission', text: 'Make professional-quality presentation coaching accessible to every student, for free.' },
              { icon: Heart, title: 'Values', text: 'Privacy first — your webcam data never leaves your browser. No accounts, no tracking, no uploads.' },
              { icon: Zap, title: 'Technology', text: 'Built with React, MediaPipe for eye tracking, Web Speech API for transcription, and Groq for AI coaching.' },
              { icon: Users, title: 'Team', text: 'Built by students at Wilfrid Laurier University for the WLU Hackathon 2026.' },
            ].map(item => (
              <div key={item.title} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/mode')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              Try Pitch Ready
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
