import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import SyllableFormationActivity from './pages/Activities/SyllableFormationActivity';
import StudentProgressPage from './pages/Progress/StudentProgressPage';
import AlphabetExplorer from './pages/Activities/AlphabetExplorer';
import Header from './components/common/Header';
import { useAuth } from '../context/AuthContext';
function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const userRole = user?.role || 'student';

  const NotFound = () => (
    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
      <h1>404 - Página Não Encontrada</h1>
      <p>Volte para o <a href="/dashboard">dashboard</a>.</p>
    </div>
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/dashboard"
          element={userRole === 'student' ? <StudentDashboard /> : <AdminDashboard />}
        />
        <Route path="/activity/syllable-formation" element={<SyllableFormationActivity />} />
        <Route path="/activity/alphabet-explorer" element={<AlphabetExplorer />} />
        <Route path="/progress" element={<StudentProgressPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;