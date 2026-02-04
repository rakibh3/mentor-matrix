import React from 'react';
import { Icon } from '@/constants';

import { BackgroundGlow, Button, Card, IconAvatar, Switch } from '@/components/ui';

interface SessionMonitorProps {
  isAttendanceOpen: boolean;
  onToggleAttendance: () => void;
  onMarkAllAbsent: () => void;
  isLoading?: boolean;
}

export const SessionMonitor: React.FC<SessionMonitorProps> = ({
  isAttendanceOpen,
  onToggleAttendance,
  onMarkAllAbsent,
  isLoading = false,
}) => {
  return (
    <Card className="border-primary/10 group relative flex flex-col justify-between gap-8 overflow-hidden rounded-[2.5rem] bg-[#121d16] p-10 shadow-2xl lg:flex-row lg:items-center">
      <BackgroundGlow
        position="top-right"
        size="sm"
        blur="md"
        className="h-64 w-64 rounded-tr-[2.5rem]"
      />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <IconAvatar variant="primary" size="sm" bordered={false} className="bg-primary/20">
            <Icon name="sensors" className="animate-pulse text-2xl" />
          </IconAvatar>
          <h3 className="text-2xl font-black tracking-tight text-white uppercase">
            Daily Session Monitor
          </h3>
        </div>
        <p className="text-text-secondary max-w-md text-sm font-medium">
          Cohort 12 is currently in{' '}
          <span className="font-bold text-white">Module 4: React Patterns</span>. The verification
          code for today's attendance has been broadcast to student dashboards.
        </p>
      </div>
      <div className="relative z-10 flex flex-wrap items-center gap-6">
        <div
          className={`flex items-center gap-4 rounded-2xl border px-6 py-3 transition-all duration-500 ${isAttendanceOpen ? 'bg-primary/5 border-primary/20 shadow-[0_0_25px_rgba(19,236,106,0.1)]' : 'bg-background-dark border-card-border'}`}
        >
          <div className="flex flex-col">
            <span className="mb-0.5 text-xs font-black tracking-widest text-gray-500 uppercase">
              Session Status
            </span>
            <span
              className={`text-sm font-black tracking-tight uppercase transition-colors ${isAttendanceOpen ? 'text-primary' : 'text-red-500'}`}
            >
              {isLoading
                ? 'Processing...'
                : isAttendanceOpen
                  ? 'Recording Open'
                  : 'Recording Closed'}
            </span>
          </div>
          <Switch
            checked={isAttendanceOpen}
            onCheckedChange={onToggleAttendance}
            disabled={isLoading}
            size="lg"
          />
        </div>
        <Button
          onClick={onMarkAllAbsent}
          variant="outline"
          size="lg"
          className="group bg-[#0c1611] px-8 tracking-[0.2em] shadow-xl hover:border-red-500/50"
        >
          <span className="text-text-secondary group-hover:text-red-400">Mark All Absent</span>
          <Icon
            name="close"
            className="text-2xl text-red-500 transition-transform group-hover:scale-110"
          />
        </Button>
      </div>
    </Card>
  );
};
