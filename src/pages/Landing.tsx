import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import {
  ArrowRight,
  Play,
  Eye,
  Activity,
  MessageSquareWarning,
  BarChart3,
  Timer,
  CheckCircle2,
  LayoutTemplate,
  Mic
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Hero Section with Sky Background */}
      <div className="relative overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/80 via-blue-400/85 to-blue-100/95 backdrop-blur-[2px]"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">
              P
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">Pitch Ready.</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#outcomes" className="hover:text-white transition-colors">Outcomes</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/setup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              Start Practicing
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer">
              <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
              Now in browser beta
              <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight leading-[1.1] mb-6 max-w-4xl">
              Practice Presentations <br className="hidden md:block" />
              With Real Feedback
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Improve eye contact, pacing, and filler words with live rehearsal analytics built for students. Speak better before it counts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate('/setup')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-base font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Practicing
              </button>
              <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-slate-900 px-8 py-3.5 rounded-full text-base font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Browser Mockup Section - Overlapping Hero */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 -mt-24 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="rounded-2xl bg-white shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex flex-col"
        >
          {/* Browser Chrome */}
          <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white border border-slate-200 rounded-md px-32 py-1 text-xs text-slate-400 flex items-center gap-2 shadow-sm">
                <LayoutTemplate className="w-3 h-3" />
                app.pitchready.com/rehearse
              </div>
            </div>
            <div className="w-16"></div>
          </div>

          {/* App UI */}
          <div className="flex flex-col md:flex-row h-[600px] bg-slate-50/50">
            {/* Left: Teleprompter */}
            <div className="flex-1 p-8 md:p-12 border-r border-slate-200 bg-white relative overflow-hidden">
              <div className="absolute top-6 left-8 flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Mic className="w-4 h-4 text-blue-500" />
                Listening...
              </div>

              <div className="h-full flex flex-col justify-center max-w-2xl mx-auto">
                <div className="text-3xl md:text-4xl leading-[1.4] font-medium text-slate-300 transition-all duration-500">
                  <span className="text-slate-300">Good morning everyone. Today I want to talk about </span>
                  <span className="text-slate-800 bg-blue-50/50 rounded-lg px-1 py-0.5 shadow-[0_0_0_2px_rgba(239,246,255,1)]">the future of sustainable energy</span>
                  <span className="text-slate-300"> and how our new initiative will reduce campus waste by 40% over the next two years. </span>
                  <span className="text-slate-200">As you can see on the first slide...</span>
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-slate-100 rounded-full">
                <div className="w-full h-1/3 bg-slate-300 rounded-full"></div>
              </div>
            </div>

            {/* Right: Live HUD */}
            <div className="w-full md:w-80 bg-slate-50 p-6 flex flex-col gap-6">
              {/* Timer */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Timer className="w-5 h-5 text-slate-400" />
                  Session Time
                </div>
                <div className="text-xl font-mono font-semibold text-slate-800">02:14</div>
              </div>

              {/* Metrics */}
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Live Metrics</h3>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Eye className="w-4 h-4 text-blue-500" />
                      Eye Contact
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Good</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 text-right">85% looking at audience</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Activity className="w-4 h-4 text-amber-500" />
                      Speech Pace
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Slightly Fast</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-semibold text-slate-800">145</span>
                    <span className="text-xs text-slate-500 mb-1">wpm</span>
                  </div>
                  <div className="mt-3 flex gap-1 h-8 items-end">
                    {[40, 60, 80, 100, 85, 90, 110, 145].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-t-sm ${i === 7 ? 'bg-amber-400' : 'bg-slate-200'}`} style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <MessageSquareWarning className="w-4 h-4 text-red-500" />
                      Filler Words
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">3 Detected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 font-medium border border-red-100">um (2)</span>
                    <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 font-medium border border-red-100">like (1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Strip */}
      <section id="features" className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Eye, title: "Eye Tracking", desc: "Know if you're reading or engaging." },
              { icon: Activity, title: "Speech Pace", desc: "Find your perfect presentation rhythm." },
              { icon: MessageSquareWarning, title: "Filler Detection", desc: "Catch 'ums' and 'ahs' in real-time." },
              { icon: BarChart3, title: "Session Feedback", desc: "Detailed reports after every practice." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">How it works</h2>
          <p className="text-lg text-slate-500 mb-16 max-w-2xl mx-auto">A simple workflow designed to get you practicing in seconds, not minutes.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-slate-200 z-0"></div>

            {[
              { step: "01", title: "Paste your script", desc: "Drop in your notes or full script. We'll format it for the teleprompter instantly." },
              { step: "02", title: "Practice with feedback", desc: "Present to your webcam. Get gentle nudges if you speak too fast or look away." },
              { step: "03", title: "Review & improve", desc: "See your stats, identify weak spots, and track your confidence over time." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-6 shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section id="outcomes" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-12">Walk into your presentation prepared.</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-left max-w-2xl mx-auto">
            {[
              "Speak with more confidence.",
              "Reduce filler words.",
              "Stay on pace.",
              "Maintain better eye contact.",
              "Nail your timing.",
              "Impress your professors."
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-lg text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <button
              onClick={() => navigate('/setup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Practicing Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="text-white font-medium">Pitch Ready</span>
          </div>

          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="text-sm">
            &copy; {new Date().getFullYear()} Pitch Ready. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
