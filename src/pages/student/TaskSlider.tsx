import React from 'react';
import { Icon } from '@/constants';
import type { Task } from '@/api/types/task.types';

interface TaskSliderProps {
  yesterdayTasks?: Task[];
  todayTasks?: Task[];
  tomorrowTasks?: Task[];
  isLoading: boolean;
  wasYesterdayAbsent?: boolean;
}

export const TaskSlider: React.FC<TaskSliderProps> = ({ 
  yesterdayTasks = [], 
  todayTasks = [], 
  tomorrowTasks = [], 
  isLoading,
  wasYesterdayAbsent = false
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-8 animate-pulse">
        <div className="h-6 w-32 bg-white/5 rounded-full" />
        <div className="h-20 w-full bg-white/5 rounded-2xl" />
        <div className="space-y-4 pt-6 border-t border-dashed border-white/10">
          <div className="h-4 w-full bg-white/5 rounded-full" />
          <div className="h-4 w-3/4 bg-white/5 rounded-full" />
        </div>
      </div>
    );
  }

  const taskCards: Array<{ 
    id: string; 
    title: string; 
    task: Task | null; 
    badge: string; 
    badgeColor: string;
    dateLabel: string;
    isToday: boolean;
    isAbsent?: boolean;
  }> = [
    {
      id: 'yesterday',
      title: "Yesterday",
      task: yesterdayTasks[0] || null,
      badge: wasYesterdayAbsent ? 'Absent' : 'Completed',
      badgeColor: wasYesterdayAbsent 
        ? 'bg-red-500/20 text-red-500 border-red-500/40' 
        : 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      dateLabel: 'Yesterday',
      isToday: false,
      isAbsent: wasYesterdayAbsent
    },
    {
      id: 'today',
      title: "Today",
      task: todayTasks[0] || null,
      badge: 'Active Now',
      badgeColor: 'bg-primary/20 text-primary border-primary/30',
      dateLabel: 'Today',
      isToday: true
    },
    {
      id: 'tomorrow',
      title: "Tomorrow",
      task: tomorrowTasks[0] || null,
      badge: 'Upcoming',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      dateLabel: 'Tomorrow',
      isToday: false
    }
  ];

  const hasAnyTask = taskCards.some(card => card.task !== null);

  if (!hasAnyTask) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 group/empty">
        <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover/empty:scale-110 group-hover/empty:rotate-12 transition-all duration-500">
          <Icon name="verified" className="text-4xl text-primary/40 group-hover/empty:text-primary transition-colors" />
        </div>
        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">All Caught Up!</h4>
        <p className="text-sm text-text-secondary font-medium opacity-60 leading-relaxed max-w-[200px]">
          No pending tasks. Keep up the great work! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-4">
      {taskCards.map((card) => {
        if (!card.task) return null;
        
        return (
          <div 
            key={card.id} 
            className={`flex flex-col p-4 rounded-xl border transition-all duration-300 ${
              card.isToday 
                ? 'bg-primary/5 border-primary/20 hover:border-primary/40' 
                : card.isAbsent
                  ? 'bg-red-500/[0.08] border-red-500/40 hover:border-red-500/60 shadow-[0_4px_20px_-10px_rgba(239,68,68,0.4)]'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black uppercase tracking-wider ${
                  card.isToday ? 'text-primary' : card.isAbsent ? 'text-red-400' : 'text-white/60'
                }`}>
                  {card.title}
                </span>
                <div className={`px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${card.badgeColor}`}>
                  <div className={`size-1 rounded-full ${
                    card.isToday ? 'bg-primary animate-pulse' : 'bg-current'
                  }`} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {card.badge}
                  </span>
                </div>
              </div>
              
              {/* Module & Mission */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black text-gray-500 uppercase">M</span>
                  <span className="text-sm font-black text-white">{card.task.moduleNumber.toString().padStart(2, '0')}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black text-gray-500 uppercase">M</span>
                  <span className="text-sm font-black text-white">{card.task.mission.toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Guideline */}
            <p className={`text-xs text-text-secondary font-medium leading-relaxed ${
              card.isToday ? 'opacity-90' : 'opacity-70 line-clamp-2'
            }`}>
              {card.task.guideline}
            </p>
          </div>
        );
      })}
    </div>
  );
};
