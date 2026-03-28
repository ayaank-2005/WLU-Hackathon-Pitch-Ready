import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Session from './pages/Session';
import Report from './pages/Report';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/session" element={<Session />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
