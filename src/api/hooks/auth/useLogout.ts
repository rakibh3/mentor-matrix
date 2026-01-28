// useLogout - Hook for logout
import { logout } from '../../endpoints/auth';

export const useLogout = () => {
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return { logout: handleLogout };
};
