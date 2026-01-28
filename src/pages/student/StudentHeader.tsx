import React from 'react';
import { Avatar, AvatarFallback, AvatarImage, Button, IconAvatar, Input, Popover, PopoverContent, PopoverTrigger, StatusDot } from '@/components/ui';





import { Icon } from '@/constants';
import type { User } from '@/types/auth';
import { getUserInitials } from '@/utils/userUtils';

interface StudentHeaderProps {
  user: User;
  onLogout: () => void;
}

/**
 * Student dashboard header component
 */
export const StudentHeader: React.FC<StudentHeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="flex-shrink-0 z-[60] flex items-center justify-between border-b border-white/5 bg-background-dark/80 backdrop-blur-xl px-4 py-3 md:px-10 md:py-4 sticky top-0">
      <div className="flex items-center gap-2 md:gap-4 group cursor-pointer transition-all hover:opacity-80 active:scale-95">
        <IconAvatar variant="primary" size="xs" bordered={false} className="size-8 md:size-12 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
          <Icon name="school" className="text-xl md:text-3xl" />
        </IconAvatar>
        <h2 className="text-sm md:text-xl font-black leading-tight tracking-tight uppercase text-white group-hover:text-primary transition-colors">DevCamp Portal</h2>
      </div>
      <div className="flex flex-1 justify-end gap-3 md:gap-8 items-center">
        <div className="hidden md:flex relative text-text-secondary focus-within:text-primary transition-all group/search">
          <Icon name="search" className="absolute left-4 top-2.5 text-xl group-focus-within/search:scale-110 transition-transform" />
          <Input  
            variant="search"
            hasIcon="left"
            className="h-11 rounded-2xl bg-white/[0.03] border-white/5 pl-12 pr-4 text-sm focus:bg-white/[0.07] focus:border-primary/50 text-white w-48 lg:w-64 transition-all focus:w-80 shadow-inner group-hover/search:border-white/10" 
            placeholder="Search history..." 
            type="text"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="size-8 md:size-11 border-2 border-white/10 shadow-2xl cursor-pointer hover:border-primary hover:scale-110 transition-all duration-500 active:scale-90 relative group/avatar">
              <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt={user.name || 'User avatar'} className="relative z-10" />
              <AvatarFallback className="bg-primary/10 text-primary font-black relative z-10">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          
          <PopoverContent align="end" className="w-85 p-0 overflow-hidden border-white/10 bg-background-dark/90 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar className="size-14 border-2 border-primary shadow-2xl">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" />
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full border-2 border-background-dark flex items-center justify-center">
                    <Icon name="verified" className="text-[10px] text-background-dark font-black" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-black text-white truncate uppercase tracking-tight">
                    {user.name || 'Student'}
                  </h4>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <StatusDot variant="primary" size="sm" pulse />
                    Active Student
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors group/item">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover/item:text-primary transition-colors">
                    Email Address
                  </span>
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-medium truncate">
                    <Icon name="mail" className="text-lg text-primary/50" />
                    {user.email}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors group/item">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover/item:text-primary transition-colors">
                    Discord Username
                  </span>
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                    <Icon name="forum" className="text-lg text-primary/50" />
                    {user.discord || 'Not linked'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 bg-white/5 border-t border-card-border">
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group/logout"
              >
                <div className="flex items-center gap-3">
                  <Icon name="logout" className="text-xl group-hover/logout:-translate-x-1 transition-transform" />
                  <span className="text-sm font-black uppercase tracking-widest">Sign Out</span>
                </div>
                <Icon name="chevron_right" className="text-lg opacity-0 group-hover/logout:opacity-100 transition-all" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
