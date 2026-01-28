
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@/constants';
import { Button, IconAvatar, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, tabsNavStyles } from '@/components/ui';




interface AdminSidebarProps {
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, isCollapsed, onToggle }) => {
  const location = useLocation();
  const navItems = [
    { path: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/admin/students", icon: "group", label: "Students" },
    { path: "/admin/analytics", icon: "analytics", label: "Analytics" },
    { path: "/admin/tasks", icon: "edit_calendar", label: "Daily Tasks" },
    { path: "/admin/settings", icon: "settings", label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin/settings") return location.pathname.startsWith("/admin/settings");
    return location.pathname === path;
  };

  return (
    <aside 
      className={`relative flex-shrink-0 bg-background-dark flex flex-col justify-between p-6 hidden md:flex transition-all duration-300 ease-in-out border-r border-border-dark/20 ${isCollapsed ? 'w-24' : 'w-72'}`}
    >
      {/* Collapse Toggle Button */}
      <Button 
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-4 top-10 size-8 bg-surface-dark border border-card-border rounded-full flex items-center justify-center text-text-secondary hover:text-primary shadow-xl z-50 group active:scale-90"
      >
        <Icon 
          name={isCollapsed ? "chevron_right" : "chevron_left"} 
          className="text-xl group-hover:scale-110 transition-transform" 
        />
      </Button>

      <div className="flex flex-col gap-10">
        <div className={`flex items-center gap-3 px-1 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
          <IconAvatar variant="primary" size="sm" className="shadow-[0_0_15px_rgba(19,236,106,0.1)] flex-shrink-0">
            <Icon name="code" className="text-2xl" />
          </IconAvatar>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-white text-base font-black leading-none tracking-tight">DEVCAMP</h1>
              <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mt-0.5">Admin Portal</p>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map(item => {
            const linkContent = (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 h-12 rounded-xl transition-all duration-200 group relative ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive(item.path) ? 'bg-primary/10 text-white' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
              >
                <Icon 
                  name={item.icon} 
                  className={`text-xl transition-colors ${isActive(item.path) ? 'text-primary' : 'group-hover:text-primary'}`} 
                />
                {!isCollapsed && (
                  <p className="text-sm font-bold tracking-tight animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap">
                    {item.label}
                  </p>
                )}
                {isActive(item.path) && isCollapsed && (
                  <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"></div>
                )}
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <React.Fragment key={item.path}>{linkContent}</React.Fragment>
            );
          })}
        </nav>
      </div>
      
      <div className={`flex items-center gap-3 p-3 bg-surface-dark/30 border border-card-border/40 rounded-2xl transition-all duration-300 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'flex-col' : ''}`}>
          <IconAvatar variant="primary" size="sm" bordered={false} className="flex-shrink-0 bg-primary/20">
            <Icon name="person" className="text-2xl" />
          </IconAvatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-white text-xs font-black truncate leading-none mb-1">Admin</p>
              <p className="text-text-secondary text-xs font-medium truncate uppercase tracking-tighter">Dev Ops</p>
            </div>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className={`p-2 text-text-secondary hover:text-red-400 active:scale-90 rounded-lg hover:bg-red-500/5 ${isCollapsed ? 'w-full flex justify-center' : ''}`}
            >
              <Icon name="logout" className="text-xl" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isCollapsed ? "right" : "top"}>Logout</TooltipContent>
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
  
  return (
    <TooltipProvider>
    <div className="flex h-screen w-full bg-[#0a120d] text-white font-display overflow-hidden selection:bg-primary/30">
      <AdminSidebar 
        onLogout={onLogout} 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-[100] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-background-dark border-r border-border-dark p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Icon name="code" className="text-primary text-2xl" />
                <span className="font-black text-white tracking-tighter uppercase">DEVCAMP</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary size-10">
                <Icon name="close" className="text-2xl" />
              </Button>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
                <Icon name="dashboard" /> Dashboard
              </Link>
              <Link to="/admin/students" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
                <Icon name="group" /> Students
              </Link>
              <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
                <Icon name="analytics" /> Analytics
              </Link>
              <Link to="/admin/tasks" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
                <Icon name="edit_calendar" /> Daily Tasks
              </Link>
              <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white transition-all">
                <Icon name="settings" /> Settings
              </Link>
            </nav>
            
            <Button 
              variant="ghost"
              onClick={onLogout}
              className="mt-auto flex items-center gap-3 px-4 py-3 h-auto justify-start rounded-xl w-full text-red-500 hover:bg-red-500/10 font-bold mt-10"
            >
              <Icon name="logout" /> Logout
            </Button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative border-l border-border-dark/10">
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-background-dark border-b border-border-dark z-50">
          <div className="flex items-center gap-3">
            <Icon name="code" className="text-primary text-2xl" />
            <span className="font-black text-white tracking-tighter uppercase">DEVCAMP</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white p-2 hover:bg-white/5 rounded-xl size-10" onClick={() => setMobileMenuOpen(true)}>
              <Icon name="menu" className="text-2xl" />
            </Button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:px-12 scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
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
    <div className={tabsNavStyles.list + " mb-8"}>
      {tabs.map(tab => (
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
