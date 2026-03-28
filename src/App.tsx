import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Landing from './pages/Landing';
import ModeSelect from './pages/ModeSelect';
import Setup from './pages/Setup';
import Session from './pages/Session';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import Report from './pages/Report';
import InterviewTips from './pages/InterviewTips';
import PitchTemplates from './pages/PitchTemplates';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import GroqTutorial from './pages/GroqTutorial';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/mode" element={<ModeSelect />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/session" element={<Session />} />
          <Route path="/interview/setup" element={<InterviewSetup />} />
          <Route path="/interview/session" element={<InterviewSession />} />
          <Route path="/report" element={<Report />} />
          <Route path="/tips" element={<InterviewTips />} />
          <Route path="/templates" element={<PitchTemplates />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/tutorial/groq" element={<GroqTutorial />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
