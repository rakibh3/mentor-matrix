import AdminRootLayout from '@/layouts/AdminRootLayout';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import NotFoundPage from '@/components/shared/NotFoundPage';
import { useAuth } from '@/hooks/useAuth';
import AdminAnalytics from '@/pages/admin/pages/AdminAnalytics';
import AdminDashboard from '@/pages/admin/pages/AdminDashboard';
import AdminSettingsAttendance from '@/pages/admin/pages/AdminSettingsAttendance';
import AdminSettingsAuth from '@/pages/admin/pages/AdminSettingsAuth';
import AdminSettingsGeneral from '@/pages/admin/pages/AdminSettingsGeneral';
import AdminSettingsTeam from '@/pages/admin/pages/AdminSettingsTeam';
import AdminStudents from '@/pages/admin/pages/AdminStudents';
import AdminTasks from '@/pages/admin/pages/AdminTasks';
import LoginPage from '@/pages/auth/pages/LoginPage';
import RegistrationPage from '@/pages/auth/pages/RegistrationPage';
import StudentDashboard from '@/pages/student/StudentDashboard';

import SrmAnalytics from '@/pages/admin/pages/SrmAnalytics';
import SrmDashboard from '@/pages/admin/pages/SrmDashboard';
import SrmSettings from '@/pages/admin/pages/SrmSettings';

import ProtectedRoute from './ProtectedRoute';

const RootRoute = () => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin' || user.role === 'superadmin' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    }
    if (user.role === 'SRM' || user.role === 'srm') {
      return <Navigate to="/srm/dashboard" />;
    }
    return <Navigate to="/student/dashboard" />;
  }
  return <LoginPage onLogin={() => {}} />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
  },
  {
    path: '/register',
    element: <RegistrationPage />,
  },
  {
    path: '/student/dashboard',
    element: <ProtectedRoute element={StudentDashboard} allowedRoles={['student', 'STUDENT']} />,
  },
  {
    path: '/srm',
    element: (
      <ProtectedRoute allowedRoles={['SRM', 'srm']}>
        <AdminRootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <SrmDashboard />,
      },
      {
        path: 'analytics',
        element: <SrmAnalytics />,
      },
      {
        path: 'settings',
        element: <SrmSettings />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'superadmin', 'ADMIN', 'SUPER_ADMIN']}>
        <AdminRootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'students',
        element: <AdminStudents />,
      },
      {
        path: 'analytics',
        element: <AdminAnalytics />,
      },
      {
        path: 'tasks',
        element: <AdminTasks />,
      },
      // Admin Settings
      {
        path: 'settings',
        element: <Navigate to="/admin/settings/general" replace />,
      },
      {
        path: 'settings/general',
        element: <AdminSettingsGeneral />,
      },
      {
        path: 'settings/auth',
        element: <AdminSettingsAuth />,
      },
      {
        path: 'settings/attendance',
        element: <AdminSettingsAttendance />,
      },
      {
        path: 'settings/team',
        element: <AdminSettingsTeam />,
      },
    ],
  },
  // 404 Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
