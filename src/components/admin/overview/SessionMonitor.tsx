
import React from 'react';
import { Icon } from '@/constants';

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
    <div className="bg-[#121d16] border border-primary/10 rounded-[2.5rem] p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none rounded-tr-[2.5rem]"></div>
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-4">
           <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
             <Icon name="sensors" className="text-2xl animate-pulse" />
           </div>
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
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isAttendanceOpen}
              onChange={onToggleAttendance}
            />
            <div className="w-14 h-8 bg-card-border border border-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:start-[6px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:bg-background-dark shadow-lg"></div>
          </label>
        </div>
        <button 
          onClick={onMarkAllAbsent}
          className="flex items-center justify-center gap-3 px-8 h-16 rounded-2xl bg-[#0c1611] border border-card-border hover:border-red-500/50 transition-all text-sm font-black uppercase tracking-[0.2em] group shadow-xl"
        >
           <span className="text-text-secondary group-hover:text-red-400">Mark All Absent</span>
           <Icon name="close" className="text-red-500 text-2xl group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};
