import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Landing from './pages/Landing';
import ModeSelect from './pages/ModeSelect';
import Setup from './pages/Setup';
import Session from './pages/Session';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import Report from './pages/Report';

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
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
