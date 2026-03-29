import { useNavigate, Link } from 'react-router-dom';
import { motion } from "motion/react";
import {
  ArrowRight, Play, Eye, Activity, MessageSquareWarning, BarChart3,
  Timer, CheckCircle2, LayoutTemplate, Mic, Shield, Zap, FileText,
  LineChart, Laptop, Sparkles, Video, Users, GraduationCap, Briefcase
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
      
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden pt-4 pb-32 lg:pb-48">
        {/* Soft Cloud Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          {/* Overlay to soften the clouds and fade smoothly into the white page below */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/60 to-white"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              P
            </div>
            <span className="text-slate-900 font-semibold text-xl tracking-tight">Pitch Ready.</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-slate-600 text-sm font-medium">
            <button onClick={() => scrollTo('features')} className="hover:text-slate-900 transition-colors">Features</button>
            <button onClick={() => scrollTo('benefits')} className="hover:text-slate-900 transition-colors">Benefits</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-slate-900 transition-colors">Pricing</button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:block text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Log in
            </button>
            <button
              onClick={() => navigate('/mode')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              Start for Free
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-blue-100 text-blue-800 text-sm font-medium mb-8 backdrop-blur-md hover:bg-white transition-colors cursor-pointer shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              Announcing our Hackathon Beta
              <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
              Ace Every Presentation <br className="hidden md:block" />
              & Interview
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice with your webcam, see yourself speak, and get real-time AI feedback on eye contact, pacing, and filler words.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate('/mode')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-base font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                Start for Free
              </button>
              <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 px-8 py-3.5 rounded-full text-base font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-slate-200">
                <Play className="w-4 h-4" />
                Get a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Browser Mockup Section */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 -mt-32 md:-mt-48 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/80 overflow-hidden flex flex-col"
        >
          {/* Browser Chrome */}
          <div className="h-12 bg-slate-50/80 border-b border-slate-200 flex items-center px-4 gap-4 backdrop-blur-sm">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white border border-slate-200 rounded-md px-24 md:px-48 py-1.5 text-xs text-slate-400 flex items-center gap-2 shadow-sm font-medium">
                <Shield className="w-3 h-3" />
                pitch-ready.xyz
              </div>
            </div>
            <div className="w-16"></div>
          </div>

          {/* App UI */}
          <div className="flex flex-col md:flex-row h-[500px] md:h-[600px] bg-white">
            {/* Left: Teleprompter & Camera */}
            <div className="flex-1 p-8 md:p-12 border-r border-slate-100 relative overflow-hidden bg-slate-50/30 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                  <Mic className="w-4 h-4 text-blue-500" />
                  Listening...
                </div>
              </div>

              {/* Teleprompter Text */}
              <div className="flex-1 flex flex-col justify-start max-w-2xl mx-auto w-full relative z-10">
                <div className="text-2xl md:text-4xl leading-[1.5] font-medium text-slate-300 transition-all duration-500">
                  <span className="text-slate-300">Hi, thank you so much for taking the time to meet with me today. </span>
                  <span className="text-slate-800 bg-blue-50 rounded-lg px-1 py-0.5 shadow-[0_0_0_2px_rgba(239,246,255,1)]">My name is Alex</span>
                  <span className="text-slate-300"> and I'm currently finishing my degree in Computer Science. </span>
                  <span className="text-slate-200">I've been following your company's work...</span>
                </div>
              </div>

              {/* Mock Webcam Preview */}
              <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-72 h-48 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white z-20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex items-end p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                    <span className="text-xs font-medium text-white/90">Good eye contact</span>
                  </div>
                </div>
                {/* Abstract person silhouette to represent webcam */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="w-24 h-24 rounded-full bg-white/20 absolute top-4"></div>
                  <div className="w-40 h-32 rounded-t-[3rem] bg-white/20 absolute bottom-0"></div>
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-1/3 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
              </div>
            </div>

            {/* Right: Live HUD */}
            <div className="w-full md:w-80 bg-white p-6 flex flex-col gap-5 overflow-y-auto">
              {/* Timer */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                  <Timer className="w-4 h-4 text-slate-400" />
                  Session Time
                </div>
                <div className="text-lg font-mono font-semibold text-slate-800">02:14</div>
              </div>

              {/* Metrics */}
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Metrics</h3>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Eye className="w-4 h-4 text-blue-500" />
                      Eye Contact
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md">Good</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 text-right font-medium">85% looking at audience</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Activity className="w-4 h-4 text-amber-500" />
                      Speech Pace
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md">Slightly Fast</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">145</span>
                    <span className="text-xs text-slate-500 mb-1 font-medium">wpm</span>
                  </div>
                  <div className="mt-3 flex gap-1 h-8 items-end">
                    {[40, 60, 80, 100, 85, 90, 110, 145].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-t-sm ${i === 7 ? 'bg-amber-400' : 'bg-slate-200'}`} style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <MessageSquareWarning className="w-4 h-4 text-red-500" />
                      Filler Words
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">3 Detected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-semibold border border-red-100">um (2)</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-semibold border border-red-100">like (1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Social Proof */}
      <section className="py-10 border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-400 mb-8">Trusted by students presenting at top institutions:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
            <span className="text-xl font-bold font-serif text-slate-800">Wilfrid Laurier</span>
            <span className="text-xl font-bold font-serif text-slate-800">Waterloo</span>
            <span className="text-xl font-bold font-serif text-slate-800">Toronto</span>
            <span className="text-xl font-bold font-serif text-slate-800">UBC</span>
            <span className="text-xl font-bold font-serif text-slate-800">McGill</span>
          </div>
        </div>
      </section>

      {/* Core Value Props (3 Cards) */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight">
              Practice with your camera on.<br />Improve with every run.
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Bring together your script, webcam, and AI-powered feedback into one rehearsal workspace — so you can see yourself improve in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Live Eye Tracking</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                See yourself on camera while AI tracks your gaze. Know exactly when you're making eye contact and when you're drifting to your notes.
              </p>
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-700">Camera Focus</span>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-md">85%</span>
                </div>
                <div className="h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Pace & Rhythm</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                Whether it's a pitch or a behavioral interview, pacing matters. We monitor your words-per-minute live and nudge you to slow down when you rush.
              </p>
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex items-end gap-2.5 h-[100px] mt-auto relative">
                <div className="absolute inset-x-0 bottom-[40%] border-t border-dashed border-slate-300 z-0"></div>
                {[40, 60, 100, 140, 160, 130].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-md transition-all duration-500 z-10 ${i === 4 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'bg-blue-200/60 group-hover:bg-blue-300/60'}`} style={{ height: `${(h/160)*100}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquareWarning className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Filler Word Detection</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                Catch the "ums", "ahs", and "likes" before your interviewer or professor does. Get a detailed breakdown of your crutch words after every run.
              </p>
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex flex-wrap gap-2.5 mt-auto">
                <span className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold shadow-sm group-hover:bg-red-50 group-hover:border-red-300 transition-colors">like (4)</span>
                <span className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold shadow-sm group-hover:bg-red-50 group-hover:border-red-300 transition-colors">um (2)</span>
                <span className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold shadow-sm group-hover:bg-red-50 group-hover:border-red-300 transition-colors">basically (1)</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Content & Answer Analysis</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                It's not just how you speak, it's what you say. Our AI analyzes the actual content of your answers and gives you notes on what you did well and what to improve.
              </p>
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 mt-auto space-y-3">
                <div className="flex gap-3 items-start bg-white p-3 rounded-xl border border-slate-200 shadow-sm group-hover:border-purple-200 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3" /></div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">Strong opening hook! You clearly established the problem right away.</p>
                </div>
                <div className="flex gap-3 items-start bg-white p-3 rounded-xl border border-slate-200 shadow-sm group-hover:border-purple-200 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-bold">!</span></div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">Your answer lacked a specific metric. Try adding a concrete number.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success at a glance (Grid) */}
      <section id="benefits" className="relative py-24 overflow-hidden">
        {/* Soft Cloud Background — matches hero lightness */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/90"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4 tracking-tight">Success at a glance</h2>
            <p className="text-slate-500">With our powerful real-time analytics, you can focus on what truly matters for your delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: LayoutTemplate, title: "Smart Teleprompter", desc: "Auto-scrolling script that matches your reading speed perfectly." },
              { icon: LineChart, title: "Detailed Analytics", desc: "Analyze performance based on pace, eye contact, and clarity." },
              { icon: Sparkles, title: "Content Analysis", desc: "Get actionable advice on your actual answers and script content." },
              { icon: Timer, title: "Real-time HUD", desc: "Gain insights into your delivery as it happens in real time." },
              { icon: Shield, title: "Privacy First", desc: "Everything runs in your browser. No video is ever recorded or uploaded." },
              { icon: Laptop, title: "No Installation", desc: "Works instantly in Chrome or Edge. No clunky software to download." },
              { icon: FileText, title: "Custom Scripts", desc: "Paste your own notes or use our built-in templates for pitches and interviews." },
              { icon: CheckCircle2, title: "Progress Tracking", desc: "Compare your current attempt against your previous ones to see growth." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-24 border-y border-slate-200/60 overflow-hidden bg-slate-50/50">
        {/* Subtle background glow to make glass pop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-6 tracking-tight">Practice for any high-stakes moment.</h2>
            <p className="text-lg text-slate-500">Whether it's a grade, a job offer, or funding on the line — be ready.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, label: "Class Presentations", desc: "Nail your delivery and engage your classmates without relying on notes." },
              { icon: Briefcase, label: "Job & Co-op Interviews", desc: "Answer behavioral questions with perfect pacing and confidence." },
              { icon: Users, label: "Startup Pitches", desc: "Project authority and clarity when speaking to potential investors." },
              { icon: Video, label: "Thesis & Case Defenses", desc: "Defend your work clearly while maintaining strong eye contact." }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 rounded-[2rem] pointer-events-none"></div>
                <div className="relative flex-1 flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:border-blue-100 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3 text-lg tracking-tight">{item.label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing + CTA + Footer — one continuous cloud section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-white/50"></div>
        </div>

        {/* Pricing */}
        <section id="pricing" className="relative z-10 py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4 tracking-tight">Simple, Student-Friendly Pricing</h2>
              <p className="text-slate-600">Choose a plan that fits your preparation needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Basic</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">$0</span>
                  <span className="text-slate-500 font-medium">/forever</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200/60">Perfect for the occasional class presentation.</p>
                <ul className="space-y-4 mb-10">
                  {['Teleprompter access', 'Basic speech recognition', 'Session timer', 'Up to 3 minutes per session'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-100 flex items-center justify-center shrink-0 bg-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/mode')} className="w-full py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                  Start for Free
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-blue-600/95 backdrop-blur-xl rounded-[2rem] p-8 border border-blue-500 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 bg-blue-500/50 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-bl-2xl rounded-tr-[2rem] border-b border-l border-blue-400/30">RECOMMENDED</div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold tracking-tight">$5</span>
                  <span className="text-blue-200 font-medium">/month</span>
                </div>
                <p className="text-sm text-blue-100 mb-8 pb-8 border-b border-blue-500/50">For serious students and job seekers.</p>
                <ul className="space-y-4 mb-10 flex-1">
                  {['Everything in Basic', 'Live Eye Tracking', 'Filler word detection', 'Unlimited session length', 'Attempt comparison'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-400/50 flex items-center justify-center shrink-0 bg-blue-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/mode')} className="w-full py-3.5 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors shadow-sm mt-auto">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative z-10 py-32">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight">Ready to ace your next pitch or interview?</h2>
            <p className="text-lg text-slate-600 mb-10">Join thousands of students who practice smarter, not harder.</p>
            <button
              onClick={() => navigate('/mode')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Practicing Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 text-slate-500 py-16 border-t border-white/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    P
                  </div>
                  <span className="text-slate-900 font-semibold text-lg tracking-tight">Pitch Ready.</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Bring your script, webcam, and AI-powered feedback into one rehearsal workspace.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                  <ul className="space-y-3">
                    <li><button onClick={() => scrollTo('features')} className="hover:text-blue-600 transition-colors">Features</button></li>
                    <li><button onClick={() => scrollTo('pricing')} className="hover:text-blue-600 transition-colors">Pricing</button></li>
                    <li><button onClick={() => scrollTo('use-cases')} className="hover:text-blue-600 transition-colors">Use Cases</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
                  <ul className="space-y-3">
                    <li><Link to="/tips" className="hover:text-blue-600 transition-colors">Interview Tips</Link></li>
                    <li><Link to="/templates" className="hover:text-blue-600 transition-colors">Pitch Templates</Link></li>
                    <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                  <ul className="space-y-3">
                    <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                    <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                    <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1">
                &copy; {new Date().getFullYear()} Pitch Ready. Built for the WLU Hackathon.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
