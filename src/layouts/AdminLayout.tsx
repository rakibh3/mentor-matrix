import React, { useState } from 'react';
import { Icon } from '@/constants';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import {
  Button,
  IconAvatar,
  tabsNavStyles,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';

interface AdminSidebarProps {
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  
  const navItems = isAdmin 
    ? [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/admin/students', icon: 'group', label: 'Students' },
        { path: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/admin/tasks', icon: 'edit_calendar', label: 'Daily Tasks' },
        { path: '/admin/settings', icon: 'settings', label: 'Settings' },
      ]
    : [
        { path: '/srm/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/srm/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/srm/settings', icon: 'settings', label: 'Settings' },
      ];

  const isActive = (path: string) => {
    if (path.includes('/settings')) return location.pathname.startsWith(path);
    return location.pathname === path;
  };

  return (
    <aside
      className={`bg-background-dark border-border-dark/20 relative flex hidden flex-shrink-0 flex-col justify-between border-r p-6 transition-all duration-300 ease-in-out md:flex ${isCollapsed ? 'w-24' : 'w-72'}`}
    >
      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="bg-surface-dark border-card-border text-text-secondary hover:text-primary group absolute top-10 -right-4 z-50 flex size-8 items-center justify-center rounded-full border shadow-xl active:scale-90"
      >
        <Icon
          name={isCollapsed ? 'chevron_right' : 'chevron_left'}
          className="text-xl transition-transform group-hover:scale-110"
        />
      </Button>

      <div className="flex flex-col gap-10">
        <div
          className={`flex items-center gap-3 px-1 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <IconAvatar
            variant="primary"
            size="sm"
            className="flex-shrink-0 shadow-[0_0_15px_rgba(19,236,106,0.1)]"
          >
            <Icon name="code" className="text-2xl" />
          </IconAvatar>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 flex flex-col duration-300">
              <h1 className="text-base leading-none font-black tracking-tight text-white">
                catchAsync
              </h1>
              <p className="text-text-secondary mt-0.5 text-xs font-bold tracking-widest uppercase">
                {isAdmin ? 'Admin Portal' : 'SRM Portal'}
              </p>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const linkContent = (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex h-12 items-center gap-3 rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive(item.path) ? 'bg-primary/10 text-white' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <Icon
                  name={item.icon}
                  className={`text-xl transition-colors ${isActive(item.path) ? 'text-primary' : 'group-hover:text-primary'}`}
                />
                {!isCollapsed && (
                  <p className="animate-in fade-in slide-in-from-left-2 text-sm font-bold tracking-tight whitespace-nowrap duration-300">
                    {item.label}
                  </p>
                )}
                {isActive(item.path) && isCollapsed && (
                  <div className="bg-primary absolute left-0 h-6 w-1 rounded-r-full"></div>
                )}
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <React.Fragment key={item.path}>{linkContent}</React.Fragment>
            );
          })}
        </nav>
      </div>

      <div
        className={`bg-surface-dark/30 border-card-border/40 flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}
      >
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'flex-col' : ''}`}>
          <IconAvatar
            variant="primary"
            size="sm"
            bordered={false}
            className="bg-primary/20 flex-shrink-0"
          >
            <Icon name="person" className="text-2xl" />
          </IconAvatar>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 flex flex-col overflow-hidden duration-300">
              <p className="mb-1 truncate text-xs leading-none font-black text-white">{user?.name || 'User'}</p>
              <p className="text-text-secondary truncate text-xs font-medium tracking-tighter uppercase">
                {isAdmin ? 'Admin' : 'SRM'}
              </p>
            </div>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className={`text-text-secondary rounded-lg p-2 hover:bg-red-500/5 hover:text-red-400 active:scale-90 ${isCollapsed ? 'flex w-full justify-center' : ''}`}
            >
              <Icon name="logout" className="text-xl" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? 'right' : 'top'}>Logout</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const navItems = isAdmin 
    ? [
        { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/admin/students', icon: 'group', label: 'Students' },
        { path: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/admin/tasks', icon: 'edit_calendar', label: 'Daily Tasks' },
        { path: '/admin/settings', icon: 'settings', label: 'Settings' },
      ]
    : [
        { path: '/srm/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { path: '/srm/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/srm/settings', icon: 'settings', label: 'Settings' },
      ];

  return (
    <TooltipProvider>
      <div className="font-display selection:bg-primary/30 flex h-screen w-full overflow-hidden bg-[#0a120d] text-white">
        <AdminSidebar
          onLogout={onLogout}
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="bg-background-dark/80 fixed inset-0 z-[100] backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="bg-background-dark border-border-dark animate-in slide-in-from-left absolute top-0 bottom-0 left-0 w-64 border-r p-6 duration-300">
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="code" className="text-primary text-2xl" />
                  <span className="font-black tracking-tighter text-white uppercase">catchAsync</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-secondary size-10"
                >
                  <Icon name="close" className="text-2xl" />
                </Button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-text-secondary flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-white/5 hover:text-white"
                  >
                    <Icon name={item.icon} /> {item.label}
                  </Link>
                ))}
              </nav>

              <Button
                variant="ghost"
                onClick={onLogout}
                className="mt-10 mt-auto flex h-auto w-full items-center justify-start gap-3 rounded-xl px-4 py-3 font-bold text-red-500 hover:bg-red-500/10"
              >
                <Icon name="logout" /> Logout
              </Button>
            </div>
          </div>
        )}

        <main className="border-border-dark/10 relative flex h-full flex-1 flex-col overflow-hidden border-l">
          <header className="bg-background-dark border-border-dark z-50 flex items-center justify-between border-b px-6 py-4 md:hidden">
            <div className="flex items-center gap-3">
              <Icon name="code" className="text-primary text-2xl" />
              <span className="font-black tracking-tighter text-white uppercase">catchAsync</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl p-2 text-white hover:bg-white/5"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Icon name="menu" className="text-2xl" />
              </Button>
            </div>
          </header>

          <div className="scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent flex-1 overflow-y-auto p-6 md:p-10 lg:px-12">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export const SettingsNav = () => {
  const location = useLocation();
  const tabs = [
    { label: 'General', path: '/admin/settings/general' },
    { label: 'Authentication', path: '/admin/settings/auth' },
    { label: 'Attendance', path: '/admin/settings/attendance' },
    { label: 'Team', path: '/admin/settings/team' },
  ];

  return (
    <div className={tabsNavStyles.list + ' mb-8'}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={tabsNavStyles.trigger(location.pathname === tab.path)}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};
