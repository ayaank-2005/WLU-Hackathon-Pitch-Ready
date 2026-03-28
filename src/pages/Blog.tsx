import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const POSTS = [
  {
    title: 'Why Eye Contact Matters More Than You Think',
    excerpt: 'Research shows that maintaining 60–70% eye contact during a presentation dramatically increases perceived confidence and trustworthiness. Here\'s how to train yourself.',
    date: 'Mar 25, 2026',
    readTime: '4 min read',
    tag: 'Public Speaking',
  },
  {
    title: 'The Science Behind Filler Words',
    excerpt: 'We all say "um" and "uh" — but why? Understanding the cognitive science behind filler words can help you reduce them without overthinking.',
    date: 'Mar 20, 2026',
    readTime: '5 min read',
    tag: 'Speech',
  },
  {
    title: 'How to Nail Your Next Behavioral Interview',
    excerpt: 'Behavioral questions are predictable if you know the patterns. We break down the top 10 questions and show you how to structure winning answers.',
    date: 'Mar 15, 2026',
    readTime: '6 min read',
    tag: 'Interviews',
  },
  {
    title: 'Presentation Pacing: Finding Your Natural Rhythm',
    excerpt: 'Speaking too fast or too slow? Learn how to find your ideal pace and use deliberate pauses to make your key points land.',
    date: 'Mar 10, 2026',
    readTime: '3 min read',
    tag: 'Public Speaking',
  },
  {
    title: 'Building Pitch Ready: A Hackathon Story',
    excerpt: 'How a team of students built a full-featured presentation coach in 36 hours using React, MediaPipe, and the Web Speech API.',
    date: 'Mar 28, 2026',
    readTime: '7 min read',
    tag: 'Behind the Scenes',
  },
];

export default function Blog() {
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
            <h1 className="text-3xl md:text-4xl font-medium text-slate-900 mb-3 tracking-tight">Blog</h1>
            <p className="text-slate-500 max-w-lg mx-auto">Tips, insights, and stories about presentations, interviews, and public speaking.</p>
          </div>

          <div className="space-y-6">
            {POSTS.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{post.tag}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3 h-3" />{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="text-slate-500 leading-relaxed mb-3">{post.excerpt}</p>
                <span className="text-sm font-medium text-blue-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
