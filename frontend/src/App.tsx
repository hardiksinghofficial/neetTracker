import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SyllabusPage from './pages/SyllabusPage';
import NcertChecklistPage from './pages/NcertChecklistPage';
import RankPredictorPage from './pages/RankPredictorPage';
import DailyLogPage from './pages/DailyLogPage';
import TimetablePage from './pages/TimetablePage';
import TestsPage from './pages/TestsPage';
import RevisionPage from './pages/RevisionPage';
import NotesPage from './pages/NotesPage';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="ncert-checklist" element={<NcertChecklistPage />} />
        <Route path="rank-predictor" element={<RankPredictorPage />} />
        <Route path="syllabus" element={<SyllabusPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="daily-log" element={<DailyLogPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="tests" element={<TestsPage />} />
        <Route path="revision" element={<RevisionPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
