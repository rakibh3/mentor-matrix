
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/pages/LoginPage';
import RegistrationPage from '@/pages/auth/pages/RegistrationPage';
import StudentDashboard from '@/pages/student/StudentDashboard';
import AdminDashboard from '@/pages/admin/pages/AdminDashboard';
import AdminStudents from '@/pages/admin/pages/AdminStudents';
import AdminAnalytics from '@/pages/admin/pages/AdminAnalytics';
import AdminTasks from '@/pages/admin/pages/AdminTasks';
import AdminSettingsGeneral from '@/pages/admin/pages/AdminSettingsGeneral';
import AdminSettingsAuth from '@/pages/admin/pages/AdminSettingsAuth';
import AdminSettingsAttendance from '@/pages/admin/pages/AdminSettingsAttendance';
import AdminSettingsTeam from '@/pages/admin/pages/AdminSettingsTeam';
import NotFoundPage from '@/components/shared/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import AdminRootLayout from '@/layouts/AdminRootLayout';
import { useAuth } from '@/hooks/useAuth';




const RootRoute = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={(user.role === 'admin' || user.role === 'superadmin') ? "/admin/dashboard" : "/student/dashboard"} />;
  }
  return <LoginPage onLogin={() => {}} />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/student/dashboard",
    element: <ProtectedRoute element={StudentDashboard} allowedRoles={['student']} />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
        <AdminRootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "students",
        element: <AdminStudents />,
      },
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },
      {
        path: "tasks",
        element: <AdminTasks />,
      },
      // Admin Settings
      {
        path: "settings",
        element: <Navigate to="/admin/settings/general" replace />,
      },
      {
        path: "settings/general",
        element: <AdminSettingsGeneral />,
      },
      {
        path: "settings/auth",
        element: <AdminSettingsAuth />,
      },
      {
        path: "settings/attendance",
        element: <AdminSettingsAttendance />,
      },
      {
        path: "settings/team",
        element: <AdminSettingsTeam />,
      },
    ]
  },
  // 404 Route
  {
    path: "*",
    element: <NotFoundPage />,
  }
]);
