import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const STEPS = [
  {
    title: 'Go to groq.com',
    description: 'Head over to groq.com and click the "Get Started" button to begin.',
    image: '/tutorial/1-groq-homepage.png',
  },
  {
    title: 'Create an account or log in',
    description: 'Sign up with Google, GitHub, SSO, or email. It\'s completely free — no credit card needed.',
    image: '/tutorial/2-login.png',
  },
  {
    title: 'Explore the dashboard',
    description: 'Once logged in, you\'ll see the Groq dashboard with available models. Scroll down to find the model list.',
    image: '/tutorial/3-dashboard.png',
  },
  {
    title: 'Find GPT OSS 20B',
    description: 'Scroll to the "Text to Text" section and click on GPT OSS 20B — this is the model Pitch Ready uses for AI analysis.',
    image: '/tutorial/4-models.png',
  },
  {
    title: 'Try it in the Playground',
    description: 'You can test the model in Groq\'s Playground before creating a key. The code snippet on the right shows how the API works.',
    image: '/tutorial/5-playground.png',
  },
  {
    title: 'Navigate to API Keys',
    description: 'Click "API Keys" in the top navigation bar, then press "+ Create API Key" to generate your key.',
    image: '/tutorial/6-api-keys.png',
  },
  {
    title: 'Create and copy your key',
    description: 'Give your key a name (anything works), leave expiration as "No expiration", and hit Submit. Copy the key that appears — you\'ll paste it into Pitch Ready.',
    image: '/tutorial/7-create-key.png',
  },
];

export default function GroqTutorial() {
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
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
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
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-3 tracking-tight">
              Get Your Free Groq API Key
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto">
              Follow these steps to create a free Groq account and generate an API key for AI-powered feedback in Pitch Ready.
            </p>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Skip to console.groq.com <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="rounded-xl overflow-hidden border border-slate-200/60 shadow-sm">
                    <img
                      src={step.image}
                      alt={`Step ${i + 1}: ${step.title}`}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 mt-8 text-center"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">You're all set!</h3>
            <p className="text-slate-600 mb-5">
              Paste your API key into the setup page and start practicing with AI-powered feedback.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('/mode')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                Start Practicing
              </button>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 hover:bg-white text-slate-700 px-8 py-3 rounded-full text-sm font-medium transition-all border border-slate-200 hover:border-slate-300 inline-flex items-center gap-2"
              >
                Open Groq Console <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
