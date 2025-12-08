import { Routes, Route, Navigate } from 'react-router-dom';
import ClientProviders from '@/components/ClientProviders.jsx';
import AppShell from './AppShell.jsx';

// Page imports
import HomePage from './pages/HomePage.jsx';
import SelectPage from './pages/SelectPage.jsx';
import PlayPage from './pages/PlayPage.jsx';
import ResultPage from './pages/ResultPage.jsx';
import MatchupsPage from './pages/MatchupsPage.jsx';

function App() {
  return (
    <ClientProviders>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quickplay" element={<Navigate to="/quickplay/select" replace />} />
          <Route path="/quickplay/select" element={<SelectPage />} />
          <Route path="/quickplay/play" element={<PlayPage />} />
          <Route path="/quickplay/play/result" element={<ResultPage />} />
          <Route path="/matchups" element={<MatchupsPage />} />
        </Routes>
      </AppShell>
    </ClientProviders>
  );
}

export default App;
