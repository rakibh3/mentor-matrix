
import React from 'react';
import { Icon, CustomSelect } from '@/constants';

interface TaskPlannerProps {
  module: string;
  onModuleChange: (val: string) => void;
  mission: string;
  onMissionChange: (val: string) => void;
  guideline: string;
  onGuidelineChange: (val: string) => void;
  onBroadcast: () => void;
  onClear: () => void;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({
  module,
  onModuleChange,
  mission,
  onMissionChange,
  guideline,
  onGuidelineChange,
  onBroadcast,
  onClear
}) => {
  return (
    <div className="flex flex-col rounded-[2.5rem] border border-card-border/50 bg-[#121d16] p-10 shadow-2xl relative group overflow-visible">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] pointer-events-none rounded-tr-[2.5rem]"></div>
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex gap-5 items-center">
          <div className="size-16 bg-[#16271e] rounded-[1.2rem] border border-primary/20 flex items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Icon name="event_note" className="text-4xl" />
          </div>
          <div className="flex flex-col">
            <p className="text-white text-2xl font-black leading-tight tracking-tight uppercase">Session Planner</p>
            <p className="text-text-secondary text-xs font-medium opacity-60">Push next day's mission to the student dashboard.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-30">
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-500 uppercase tracking-[0.15em] ml-1">Curriculum Module</label>
          <CustomSelect 
            value={module} 
            options={["Module 1", "Module 2", "Module 3", "Module 4", "Module 5", "Module 6"]} 
            onChange={onModuleChange} 
            icon="layers" 
          />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-500 uppercase tracking-[0.15em] ml-1">Active Mission</label>
          <CustomSelect 
            value={mission} 
            options={["Mission 1", "Mission 2", "Mission 3", "Mission 4", "Mission 5", "Mission 6", "Mission 7", "Mission 8"]} 
            onChange={onMissionChange} 
            icon="rocket_launch" 
          />
        </div>
      </div>
      <div className="space-y-3 mb-10 relative z-10">
        <label className="text-xs font-black text-gray-500 uppercase tracking-[0.15em] ml-1">Learning Guideline</label>
        <textarea 
          value={guideline} 
          onChange={(e) => onGuidelineChange(e.target.value)} 
          className="w-full rounded-[1.5rem] border border-card-border/30 bg-[#0c1310] text-white h-40 p-6 text-sm font-medium leading-relaxed outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-gray-800" 
          placeholder="Describe the focus for tomorrow's session..."
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <button 
          onClick={onBroadcast}
          className="flex-[3] h-16 rounded-2xl bg-primary text-background-dark text-sm font-black uppercase tracking-[0.2em] leading-none hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-3 group/btn"
        >
          <Icon name="send" className="text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          <span>Broadcast Task</span>
        </button>
        <button 
          onClick={onClear} 
          className="flex-1 h-16 rounded-2xl border border-card-border bg-transparent text-text-secondary text-sm font-black uppercase tracking-[0.2em] leading-none hover:bg-white/5 hover:text-white transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
        >
          <Icon name="refresh" className="text-xl" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
