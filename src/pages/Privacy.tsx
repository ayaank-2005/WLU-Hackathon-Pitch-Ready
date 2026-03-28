import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const SECTIONS = [
  {
    title: 'Overview',
    content: 'Pitch Ready is a browser-based presentation practice tool. We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.',
  },
  {
    title: 'Data We Collect',
    content: `Pitch Ready processes the following data entirely in your browser:

• Camera feed — used for real-time eye tracking via MediaPipe. Video frames are processed locally and never transmitted.
• Microphone audio — used for speech-to-text via the Web Speech API (processed by your browser, not our servers).
• Session results — scores, transcripts, and metrics are stored in your browser's localStorage. They are never sent to any server.

We do not collect personal information, create user accounts, or use cookies for tracking.`,
  },
  {
    title: 'Third-Party APIs',
    content: `If you provide an API key for Groq, your script and transcript may be sent to that service for AI-powered feedback. This is optional and only happens when you explicitly provide a key. We do not store or transmit your API keys — they are held in your browser's localStorage and sent directly from your browser to the API provider.`,
  },
  {
    title: 'Data Storage',
    content: `All session data is stored in your browser's localStorage. This includes:
• Previous session results (for comparison)
• Your API key (if provided)

You can clear this data at any time by clearing your browser's site data for this domain.`,
  },
  {
    title: 'No Server-Side Processing',
    content: 'Pitch Ready is a fully client-side application. We do not operate servers that receive, store, or process your camera feed, audio, transcripts, or any other personal data. All processing happens in your browser.',
  },
  {
    title: 'Open Source',
    content: 'Pitch Ready is open source. You can inspect the entire codebase at github.com/ayaank-2005/WLU-Hackathon-Pitch-Ready to verify our privacy practices.',
  },
  {
    title: 'Changes to This Policy',
    content: 'If we make changes to this privacy policy, we will update this page. This policy was last updated on March 28, 2026.',
  },
  {
    title: 'Contact',
    content: 'If you have questions about this privacy policy, please open an issue on our GitHub repository or email hello@pitchready.app.',
  },
];

export default function Privacy() {
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
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-3 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500">Last updated March 28, 2026</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-8">
            {SECTIONS.map(s => (
              <div key={s.title}>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">{s.title}</h2>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{s.content}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
