import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import type { User, UserRole } from '@/types/auth'; // Updated import

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
  element?: React.ComponentType<{ user: User; onLogout: () => void }>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  element: Component,
}) => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="bg-background-dark flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they have the wrong role
    let fallbackPath = '/';
    if (user.role === 'admin' || user.role === 'superadmin') {
      fallbackPath = '/admin/dashboard';
    } else if (user.role === 'student') {
      fallbackPath = '/student/dashboard';
    } else if (user.role === 'srm' || user.role === 'SRM') {
      fallbackPath = '/srm/dashboard';
    }
    return <Navigate to={fallbackPath} replace />;
  }

  if (Component) {
    return <Component user={user} onLogout={logout} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
