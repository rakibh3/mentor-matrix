import React from 'react';
import { Icon } from '@/constants';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  IconAvatar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StatusDot,
} from '@/components/ui';
import { getUserInitials } from '@/utils/userUtils';
import type { User } from '@/types/auth';

interface StudentHeaderProps {
  user: User;
  onLogout: () => void;
}

/**
 * Student dashboard header component
 */
export const StudentHeader: React.FC<StudentHeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-background-dark/80 sticky top-0 z-[60] flex flex-shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 backdrop-blur-xl md:px-10 md:py-4">
      <div className="group flex cursor-pointer items-center gap-2 transition-all hover:opacity-80 active:scale-95 md:gap-4">
        <IconAvatar
          variant="primary"
          size="xs"
          bordered={false}
          className="size-8 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-[15deg] group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] md:size-12"
        >
          <Icon name="school" className="text-xl md:text-3xl" />
        </IconAvatar>
        <h2 className="group-hover:text-primary text-sm leading-tight font-black tracking-tight text-white uppercase transition-colors md:text-xl">
          DevCamp Portal
        </h2>
      </div>
      <div className="flex flex-1 items-center justify-end gap-3 md:gap-8">
        <div className="text-text-secondary focus-within:text-primary group/search relative hidden transition-all md:flex">
          <Icon
            name="search"
            className="absolute top-2.5 left-4 text-xl transition-transform group-focus-within/search:scale-110"
          />
          <Input
            variant="search"
            hasIcon="left"
            className="focus:border-primary/50 h-11 w-48 rounded-2xl border-white/5 bg-white/[0.03] pr-4 pl-12 text-sm text-white shadow-inner transition-all group-hover/search:border-white/10 focus:w-80 focus:bg-white/[0.07] lg:w-64"
            placeholder="Search history..."
            type="text"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="hover:border-primary group/avatar relative size-8 cursor-pointer border-2 border-white/10 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 md:size-11">
              <div className="bg-primary/20 absolute inset-0 opacity-0 blur-md transition-opacity group-hover/avatar:opacity-100" />
              <AvatarImage
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                alt={user.name || 'User avatar'}
                className="relative z-10"
              />
              <AvatarFallback className="bg-primary/10 text-primary relative z-10 font-black">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="bg-background-dark/90 animate-in fade-in zoom-in-95 w-85 overflow-hidden border-white/10 p-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl duration-300"
          >
            <div className="from-primary/50 via-primary to-primary/50 absolute top-0 right-0 left-0 h-1 bg-gradient-to-r" />
            <div className="p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative">
                  <Avatar className="border-primary size-14 border-2 shadow-2xl">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-black">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-primary border-background-dark absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2">
                    <Icon name="verified" className="text-background-dark text-[10px] font-black" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-lg font-black tracking-tight text-white uppercase">
                    {user.name || 'Student'}
                  </h4>
                  <p className="text-primary flex items-center gap-1.5 text-[10px] font-black tracking-[0.2em] uppercase">
                    <StatusDot variant="primary" size="sm" pulse />
                    Active Student
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="hover:border-primary/20 group/item flex flex-col gap-1.5 rounded-2xl border border-white/5 bg-white/5 p-3 transition-colors">
                  <span className="group-hover/item:text-primary text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase transition-colors">
                    Email Address
                  </span>
                  <div className="text-text-secondary flex items-center gap-2 truncate text-sm font-medium">
                    <Icon name="mail" className="text-primary/50 text-lg" />
                    {user.email}
                  </div>
                </div>

                <div className="hover:border-primary/20 group/item flex flex-col gap-1.5 rounded-2xl border border-white/5 bg-white/5 p-3 transition-colors">
                  <span className="group-hover/item:text-primary text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase transition-colors">
                    Discord Username
                  </span>
                  <div className="text-text-secondary flex items-center gap-2 text-sm font-medium">
                    <Icon name="forum" className="text-primary/50 text-lg" />
                    {user.discord || 'Not linked'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-card-border border-t bg-white/5 p-2">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="group/logout flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name="logout"
                    className="text-xl transition-transform group-hover/logout:-translate-x-1"
                  />
                  <span className="text-sm font-black tracking-widest uppercase">Sign Out</span>
                </div>
                <Icon
                  name="chevron_right"
                  className="text-lg opacity-0 transition-all group-hover/logout:opacity-100"
                />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
