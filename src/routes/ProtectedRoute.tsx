import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole, User } from '@/types/auth'; // Updated import
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
  element?: React.ComponentType<{ user: User; onLogout: () => void }>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  element: Component
}) => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark">
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
    }
    return <Navigate to={fallbackPath} replace />;
  }

  if (Component) {
    return <Component user={user} onLogout={logout} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
