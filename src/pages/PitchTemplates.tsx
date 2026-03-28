import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Briefcase, GraduationCap, Rocket, Building2, Award, Presentation } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useSession } from '../context/SessionContext';

const TEMPLATES = [
  {
    icon: Rocket,
    title: 'Elevator Pitch',
    duration: '1 min',
    category: 'Startup',
    script: `Good morning — I'm [Name], and I'm building [Product Name].

Every day, [target audience] struggles with [core problem]. The current solutions are [pain point], leaving them [negative outcome].

[Product Name] solves this by [key mechanism]. We [unique value proposition], which means [benefit to user].

In the last [timeframe], we've [traction metric] — and we're just getting started. We're looking for [ask — funding, partnerships, users] to [next milestone].

I'd love to show you a quick demo. Can we set up 15 minutes this week?`,
  },
  {
    icon: Briefcase,
    title: 'Business Pitch',
    duration: '3–5 min',
    category: 'Business',
    script: `Thank you for your time today. I'm [Name], [role] at [Company].

Let me start with a question: [rhetorical question related to the problem].

The reality is [problem statement with data]. This affects [who] and costs [what — time, money, opportunity].

Our solution is [Product/Service]. Here's how it works:
1. [Step one — simple explanation]
2. [Step two — how it's different]
3. [Step three — the result]

What makes us different is [competitive advantage]. Unlike [competitor approach], we [differentiator].

Our numbers tell the story: [key metrics — revenue, users, growth rate].

We're seeking [specific ask] to achieve [specific goal] by [timeline].

I'm happy to take questions.`,
  },
  {
    icon: GraduationCap,
    title: 'Thesis Defense',
    duration: '10–15 min',
    category: 'Academic',
    script: `Good afternoon, committee members. My name is [Name], and my thesis is titled "[Thesis Title]."

My research addresses the question: [research question].

This matters because [significance and gap in existing literature].

My methodology involved [brief methodology overview — qualitative, quantitative, mixed methods]. I collected data from [source] over [timeframe].

Key findings include:
- [Finding 1 with supporting data]
- [Finding 2 with supporting data]
- [Finding 3 with supporting data]

These results suggest that [interpretation and implications].

Limitations of this study include [honest limitations]. Future research could explore [directions].

In conclusion, this work contributes to [field] by [contribution]. Thank you — I welcome your questions.`,
  },
  {
    icon: Presentation,
    title: 'Project Presentation',
    duration: '5–8 min',
    category: 'Work / School',
    script: `Hi everyone, today I'll be walking you through [Project Name].

The goal of this project was to [objective]. We set out to [solve X / build Y / improve Z].

Here's an overview of our approach:
- Phase 1: [Research / Planning — what you did and why]
- Phase 2: [Development / Execution — key decisions made]
- Phase 3: [Testing / Iteration — what you learned]

Let me show you the results. [Walk through key deliverables or demo].

The biggest challenge we faced was [challenge]. We overcame it by [solution].

Key takeaways:
1. [Lesson or result]
2. [Lesson or result]
3. [Lesson or result]

Next steps include [what comes after]. Thank you — happy to answer any questions.`,
  },
  {
    icon: Building2,
    title: 'Job Interview Intro',
    duration: '1–2 min',
    category: 'Interview',
    script: `Thank you for having me. I'm [Name], and I'm excited about this opportunity.

I'm currently [current role/status — student at X, working at Y]. Over the past [timeframe], I've focused on [relevant area].

What draws me to this role is [specific reason — the team, the product, the mission]. I noticed [something specific about the company] and that resonates with my experience in [relevant experience].

A quick example: at [company/school], I [specific accomplishment with measurable result]. That experience taught me [relevant skill or lesson].

I'm looking for a role where I can [what you want to contribute] while growing in [area of development].

I'd love to learn more about the team and how I can contribute.`,
  },
  {
    icon: Award,
    title: 'Hackathon Demo',
    duration: '2–3 min',
    category: 'Tech',
    script: `Hey everyone — we're [Team Name], and we built [Project Name].

The problem: [one-sentence problem statement].

We talked to [users/research] and found that [insight].

So we built [Product Name]. Let me show you how it works.

[Live demo walkthrough — keep it to 3–4 key interactions]

Under the hood, we're using [tech stack highlights — keep it brief].

What makes this special is [unique differentiator].

In [hackathon duration], we [what you accomplished]. With more time, we'd [future vision].

We think this could help [who] by [impact]. Thanks!`,
  },
];

export default function PitchTemplates() {
  const navigate = useNavigate();
  const session = useSession();
  const [copied, setCopied] = useState<string | null>(null);

  const handleUseTemplate = (script: string, title: string) => {
    session.setMode('presentation');
    session.setScript(script);
    navigate('/setup');
  };

  const handleCopy = (script: string, title: string) => {
    navigator.clipboard.writeText(script);
    setCopied(title);
    setTimeout(() => setCopied(null), 2000);
  };

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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-3 tracking-tight">Pitch Templates</h1>
            <p className="text-slate-500 max-w-lg mx-auto">Ready-to-use scripts for every scenario. Copy one, customize it, and start rehearsing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <t.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{t.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{t.category}</span>
                        <span>&middot;</span>
                        <span>{t.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed border border-slate-100 flex-1 max-h-32 overflow-hidden relative">
                  <pre className="whitespace-pre-wrap font-sans">{t.script.slice(0, 200)}...</pre>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50/80 to-transparent" />
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUseTemplate(t.script, t.title)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => handleCopy(t.script, t.title)}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white/50 flex items-center justify-center hover:bg-white transition-all"
                  >
                    {copied === t.title ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
