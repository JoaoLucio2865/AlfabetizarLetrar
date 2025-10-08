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

function App() {
  const isAuthenticated = true;
  const userRole = 'student';

  return (
    <>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {isAuthenticated ? (
          <>
            <Route
              path="/dashboard"
              element={
                userRole === 'student' ? <StudentDashboard /> : <AdminDashboard />
              }
            />
            <Route path="/activity/syllable-formation" element={<SyllableFormationActivity />} />
            <Route path="/activity/alphabet-explorer" element={<AlphabetExplorer />} />
            <Route path="/progress" element={<StudentProgressPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
