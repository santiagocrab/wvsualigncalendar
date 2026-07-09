import { HashRouter, Routes, Route } from 'react-router-dom';
import { EventsProvider } from './context/EventsContext';
import { AppLayout } from './components/Layout';
import DashboardPage from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import ConflictsPage from './pages/Conflicts';
import OrganizationsPage from './pages/Organizations';
import ApprovalPage from './pages/Approval';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <EventsProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/conflicts" element={<ConflictsPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/approval" element={<ApprovalPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
      </EventsProvider>
    </HashRouter>
  );
}
