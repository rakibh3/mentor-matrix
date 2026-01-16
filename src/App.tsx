import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/login/LoginPage';
import RegistrationPage from '@/pages/registration/RegistrationPage';
import StudentDashboard from '@/pages/student/StudentDashboard';
import AdminDashboard from '@/pages/admin/overview/AdminDashboard';
import AdminStudents from '@/pages/admin/student/AdminStudents';
import AdminAnalytics from '@/pages/admin/analytic/AdminAnalytics';
import AdminTasks from '@/pages/admin/task/AdminTasks';
import AdminSettingsGeneral from '@/pages/admin/settings/AdminSettingsGeneral';
import AdminSettingsAuth from '@/pages/admin/settings/AdminSettingsAuth';
import AdminSettingsAttendance from '@/pages/admin/settings/AdminSettingsAttendance';
import AdminSettingsTeam from '@/pages/admin/settings/AdminSettingsTeam';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { ToastContainer } from '@/components/shared/ToastContainer';

const MainContent: React.FC = () => {
  const { addToast } = useToast();
  const [user, setUser] = useState<{ role: 'admin' | 'student', email: string } | null>(null);

  const handleLogin = (email: string) => {
    const role = email.includes('admin') ? 'admin' : 'student';
    setUser({ role, email });
  };

  const handleLogout = () => {
    setUser(null);
    addToast({
      type: 'info',
      title: 'Session Ended',
      message: 'You have been securely logged out. Returning to the login portal.'
    });
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to={user.role === 'admin' ? "/admin/dashboard" : "/student/dashboard"} /> : <LoginPage onLogin={handleLogin} />} 
        />
        <Route path="/register" element={<RegistrationPage />} />
        
        {/* Student Routes */}
        <Route 
          path="/student/dashboard" 
          element={user?.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route path="/admin/students" element={user?.role === 'admin' ? <AdminStudents onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/analytics" element={user?.role === 'admin' ? <AdminAnalytics onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/tasks" element={user?.role === 'admin' ? <AdminTasks onLogout={handleLogout} /> : <Navigate to="/" />} />
        
        {/* Admin Settings */}
        <Route path="/admin/settings" element={<Navigate to="/admin/settings/general" replace />} />
        <Route path="/admin/settings/general" element={user?.role === 'admin' ? <AdminSettingsGeneral onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/settings/auth" element={user?.role === 'admin' ? <AdminSettingsAuth onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/settings/attendance" element={user?.role === 'admin' ? <AdminSettingsAttendance onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/settings/team" element={user?.role === 'admin' ? <AdminSettingsTeam onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <MainContent />
      <ToastContainer />
    </ToastProvider>
  );
};

export default App;