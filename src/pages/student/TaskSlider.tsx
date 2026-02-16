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
  wasYesterdayAbsent = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex animate-pulse flex-col gap-6 py-8">
        <div className="h-6 w-32 rounded-full bg-white/5" />
        <div className="h-20 w-full rounded-2xl bg-white/5" />
        <div className="space-y-4 border-t border-dashed border-white/10 pt-6">
          <div className="h-4 w-full rounded-full bg-white/5" />
          <div className="h-4 w-3/4 rounded-full bg-white/5" />
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
      title: 'Yesterday',
      task: yesterdayTasks[0] || null,
      badge: wasYesterdayAbsent ? 'Absent' : 'Completed',
      badgeColor: wasYesterdayAbsent
        ? 'bg-red-500/20 text-red-500 border-red-500/40'
        : 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      dateLabel: 'Yesterday',
      isToday: false,
      isAbsent: wasYesterdayAbsent,
    },
    {
      id: 'today',
      title: 'Today',
      task: todayTasks[0] || null,
      badge: 'Active Now',
      badgeColor: 'bg-primary/20 text-primary border-primary/30',
      dateLabel: 'Today',
      isToday: true,
    },
    {
      id: 'tomorrow',
      title: 'Tomorrow',
      task: tomorrowTasks[0] || null,
      badge: 'Upcoming',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      dateLabel: 'Tomorrow',
      isToday: false,
    },
  ];

  const hasAnyTask = taskCards.some((card) => card.task !== null);

  if (!hasAnyTask) {
    return (
      <div className="group/empty flex flex-col items-center justify-center px-4 py-10 text-center">
        <div className="bg-primary/5 mb-6 flex size-16 items-center justify-center rounded-2xl transition-all duration-500 group-hover/empty:scale-110 group-hover/empty:rotate-12">
          <Icon
            name="verified"
            className="text-primary/40 group-hover/empty:text-primary text-4xl transition-colors"
          />
        </div>
        <h4 className="mb-2 text-xl font-black tracking-tight text-white uppercase">
          All Caught Up!
        </h4>
        <p className="text-text-secondary max-w-[200px] text-sm leading-relaxed font-medium opacity-60">
          No pending tasks. Keep up the great work! ✨
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col gap-4">
      {taskCards.map((card) => {
        if (!card.task) return null;

        return (
          <div
            key={card.id}
            className={`flex flex-col rounded-xl border p-4 transition-all duration-300 ${
              card.isToday
                ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                : card.isAbsent
                  ? 'border-red-500/40 bg-red-500/[0.08] shadow-[0_4px_20px_-10px_rgba(239,68,68,0.4)] hover:border-red-500/60'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
            }`}
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black tracking-wider uppercase ${
                    card.isToday ? 'text-primary' : card.isAbsent ? 'text-red-400' : 'text-white/60'
                  }`}
                >
                  {card.title}
                </span>
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 ${card.badgeColor}`}
                >
                  <div
                    className={`size-1 rounded-full ${
                      card.isToday ? 'bg-primary animate-pulse' : 'bg-current'
                    }`}
                  />
                  <span className="text-[9px] font-black tracking-widest uppercase">
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Module & Mission */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black text-gray-500 uppercase">Module</span>
                  <span className="text-sm font-black text-white">
                    {card.task.moduleNumber.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black text-gray-500 uppercase">Mission</span>
                  <span className="text-sm font-black text-white">
                    {card.task.mission.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Guideline */}
            <p
              className={`text-text-secondary text-xs leading-relaxed font-medium ${
                card.isToday ? 'opacity-90' : 'line-clamp-2 opacity-70'
              }`}
            >
              {card.task.guideline}
            </p>
          </div>
        );
      })}
    </div>
  );
};
