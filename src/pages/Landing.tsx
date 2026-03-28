import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import {
  ArrowRight, Play, Eye, Activity, MessageSquareWarning, BarChart3,
  Timer, CheckCircle2, LayoutTemplate, Mic, Shield, Zap, FileText,
  LineChart, Laptop, Sparkles, Video, Users, GraduationCap, Briefcase
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

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
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#benefits" className="hover:text-slate-900 transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:block text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Log in
            </button>
            <button
              onClick={() => navigate('/setup')}
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-blue-100 text-blue-800 text-sm font-medium mb-8 backdrop-blur-md hover:bg-white/80 transition-colors cursor-pointer shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              Announcing our Hackathon Beta
              <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-medium text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
              Ace Every Presentation <br className="hidden md:block" />
              & Interview
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice presentations and interviews with your webcam, see yourself speak, and get real-time AI feedback on eye contact, pacing, and filler words.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate('/setup')}
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
                app.pitchready.com/rehearse
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
                <div className="w-full h-1/3 bg-slate-300 rounded-full"></div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Live Eye Tracking</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                See yourself on camera while AI tracks your gaze. Know exactly when you're making eye contact and when you're drifting to your notes.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">Camera Focus</span>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">85%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Pace & Rhythm</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Whether it's a pitch or a behavioral interview, pacing matters. We monitor your words-per-minute live and nudge you to slow down when you rush.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-end gap-3 h-[76px]">
                {[40, 60, 100, 140, 160, 130].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-sm ${i === 4 ? 'bg-amber-400' : 'bg-blue-200'}`} style={{ height: `${(h/160)*100}%` }}></div>
                ))}
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                <MessageSquareWarning className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Filler Word Detection</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Catch the "ums", "ahs", and "likes" before your interviewer or professor does. Get a detailed breakdown of your crutch words after every run.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-lg text-sm font-medium shadow-sm">like (4)</span>
                <span className="px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-lg text-sm font-medium shadow-sm">um (2)</span>
                <span className="px-3 py-1.5 bg-white border border-red-100 text-red-600 rounded-lg text-sm font-medium shadow-sm">basically (1)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success at a glance (Grid) */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4 tracking-tight">Success at a glance</h2>
            <p className="text-slate-500">With our powerful real-time analytics, you can focus on what truly matters for your delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: LayoutTemplate, title: "Smart Teleprompter", desc: "Auto-scrolling script that matches your reading speed perfectly." },
              { icon: LineChart, title: "Detailed Analytics", desc: "Analyze performance based on pace, eye contact, and clarity." },
              { icon: Sparkles, title: "Personalized Tips", desc: "Get actionable advice on how to improve after every session." },
              { icon: Timer, title: "Real-time HUD", desc: "Gain insights into your delivery as it happens in real time." },
              { icon: Shield, title: "Privacy First", desc: "Everything runs in your browser. No video is ever recorded or uploaded." },
              { icon: Laptop, title: "No Installation", desc: "Works instantly in Chrome or Edge. No clunky software to download." },
              { icon: FileText, title: "Custom Scripts", desc: "Paste your own notes or use our built-in templates for pitches and interviews." },
              { icon: CheckCircle2, title: "Progress Tracking", desc: "Compare your current attempt against your previous ones to see growth." }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-6 tracking-tight">Practice for any high-stakes moment.</h2>
          <p className="text-lg text-slate-500 mb-16">Whether it's a grade, a job offer, or funding on the line — be ready.</p>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { icon: GraduationCap, label: "Class Presentations", color: "bg-purple-100 text-purple-600" },
              { icon: Briefcase, label: "Job & Co-op Interviews", color: "bg-blue-100 text-blue-600" },
              { icon: Users, label: "Startup Pitches", color: "bg-emerald-100 text-emerald-600" },
              { icon: Video, label: "Thesis & Case Defenses", color: "bg-rose-100 text-rose-600" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} shadow-sm`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="font-medium text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4 tracking-tight">Simple, Student-Friendly Pricing</h2>
            <p className="text-slate-500">Choose a plan that fits your preparation needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Basic</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500">/forever</span>
              </div>
              <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">Perfect for the occasional class presentation.</p>
              <ul className="space-y-4 mb-8">
                {['Teleprompter access', 'Basic speech recognition', 'Session timer', 'Up to 3 minutes per session'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/setup')} className="w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-slate-200 transition-colors">
                Start for Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600 rounded-3xl p-8 border border-blue-600 shadow-xl shadow-blue-900/10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">RECOMMENDED</div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-blue-200">/month</span>
              </div>
              <p className="text-sm text-blue-100 mb-8 pb-8 border-b border-blue-500">For serious students and job seekers.</p>
              <ul className="space-y-4 mb-8">
                {['Everything in Basic', 'Live Eye Tracking', 'Filler word detection', 'Unlimited session length', 'Attempt comparison'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-blue-50">
                    <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/setup')} className="w-full py-3 rounded-xl bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-32 overflow-hidden">
        {/* Soft Cloud Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        >
          {/* Overlay to soften the clouds and fade smoothly from the white page above */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/80 to-white"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-slate-900 mb-6 tracking-tight">Ready to ace your next pitch or interview?</h2>
          <p className="text-lg text-slate-600 mb-10">Join thousands of students who practice smarter, not harder.</p>
          <button
            onClick={() => navigate('/setup')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Practicing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-500 py-12 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="text-slate-900 font-semibold">Pitch Ready</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
          
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Pitch Ready. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
