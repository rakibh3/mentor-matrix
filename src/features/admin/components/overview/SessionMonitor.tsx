
import React from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { BackgroundGlow } from '@/components/ui/background-glow';

interface SessionMonitorProps {
  isAttendanceOpen: boolean;
  onToggleAttendance: () => void;
  onMarkAllAbsent: () => void;
}

export const SessionMonitor: React.FC<SessionMonitorProps> = ({
  isAttendanceOpen,
  onToggleAttendance,
  onMarkAllAbsent
}) => {
  return (
    <Card className="bg-[#121d16] border-primary/10 rounded-[2.5rem] p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
      <BackgroundGlow position="top-right" size="sm" blur="md" className="w-64 h-64 rounded-tr-[2.5rem]" />
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-4">
           <IconAvatar variant="primary" size="sm" bordered={false} className="bg-primary/20">
             <Icon name="sensors" className="text-2xl animate-pulse" />
           </IconAvatar>
           <h3 className="text-white text-2xl font-black uppercase tracking-tight">Daily Session Monitor</h3>
        </div>
        <p className="text-text-secondary text-sm max-w-md font-medium">
          Cohort 12 is currently in <span className="text-white font-bold">Module 4: React Patterns</span>. 
          The verification code for today's attendance has been broadcast to student dashboards.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-6 relative z-10">
        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-500 ${isAttendanceOpen ? 'bg-primary/5 border-primary/20 shadow-[0_0_25px_rgba(19,236,106,0.1)]' : 'bg-background-dark border-card-border'}`}>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-0.5">Session Status</span>
            <span className={`text-sm font-black uppercase tracking-tight transition-colors ${isAttendanceOpen ? 'text-primary' : 'text-red-500'}`}>
              {isAttendanceOpen ? 'Recording Open' : 'Recording Closed'}
            </span>
          </div>
          <Switch 
              checked={isAttendanceOpen}
              onCheckedChange={onToggleAttendance}
              size="lg"
            />
        </div>
        <Button 
          onClick={onMarkAllAbsent}
          variant="outline"
          size="lg"
          className="px-8 bg-[#0c1611] hover:border-red-500/50 tracking-[0.2em] group shadow-xl"
        >
           <span className="text-text-secondary group-hover:text-red-400">Mark All Absent</span>
           <Icon name="close" className="text-red-500 text-2xl group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};
