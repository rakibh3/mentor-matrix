import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

const AdminRootLayout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <AdminLayout onLogout={logout}>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminRootLayout;
