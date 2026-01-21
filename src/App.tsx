import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegistrationPage from '@/features/auth/pages/RegistrationPage';
import StudentDashboard from '@/features/student/pages/StudentDashboard';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import AdminStudents from '@/features/admin/pages/AdminStudents';
import AdminAnalytics from '@/features/admin/pages/AdminAnalytics';
import AdminTasks from '@/features/admin/pages/AdminTasks';
import AdminSettingsGeneral from '@/features/admin/pages/AdminSettingsGeneral';
import AdminSettingsAuth from '@/features/admin/pages/AdminSettingsAuth';
import AdminSettingsAttendance from '@/features/admin/pages/AdminSettingsAttendance';
import AdminSettingsTeam from '@/features/admin/pages/AdminSettingsTeam';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/sonner';

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
    <>
      <MainContent />
      <Toaster />
    </>
  );
};

export default App;
