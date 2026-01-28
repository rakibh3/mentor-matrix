import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
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
