
import React from 'react';
import { Icon } from '@/constants';

interface CohortStat {
  name: string;
  students: number;
  progress: number;
  attendance: number;
}

interface AnalyticsSnapshotProps {
  cohortStats: CohortStat[];
}

export const AnalyticsSnapshot: React.FC<AnalyticsSnapshotProps> = ({ cohortStats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 bg-card-dark border border-card-border rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center justify-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <h4 className="text-white text-xl font-black uppercase tracking-tight">Today's Snapshot</h4>
          <p className="text-text-secondary text-sm font-medium uppercase tracking-widest">Attendance Distribution Across Cohorts</p>
        </div>
        <div className="relative size-56">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-background-dark" strokeWidth="3"></circle>
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="92, 100" strokeLinecap="round"></circle>
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-red-500/30" strokeWidth="3" strokeDasharray="8, 100" strokeDashoffset="-92" strokeLinecap="round"></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white tracking-tighter">92%</span>
            <span className="text-xs font-black text-primary uppercase tracking-widest">On Track</span>
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4 mt-4">
           <div className="flex items-center gap-4 p-5 bg-background-dark/50 rounded-2xl border border-card-border">
             <div className="size-3 rounded-full bg-primary shadow-[0_0_12px_#13ec6a]"></div>
             <div className="flex flex-col"><span className="text-white text-lg font-black leading-none">142</span><span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Present On Time</span></div>
           </div>
           <div className="flex items-center gap-4 p-5 bg-background-dark/50 rounded-2xl border border-card-border">
             <div className="size-3 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]"></div>
             <div className="flex flex-col"><span className="text-white text-lg font-black leading-none">12</span><span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Absent Today</span></div>
           </div>
        </div>
      </div>

      <div className="lg:col-span-6 bg-card-dark border border-card-border rounded-[2.5rem] p-10 shadow-2xl flex flex-col gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-primary/50 to-transparent"></div>
         <div className="flex justify-between items-center">
          <div>
            <h4 className="text-white text-xl font-black uppercase tracking-tight">Cohort Comparison</h4>
            <p className="text-text-secondary text-xs font-black uppercase tracking-widest mt-1">Relative performance index</p>
          </div>
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20"><Icon name="compare_arrows" className="text-2xl" /></div>
        </div>
        <div className="flex flex-col gap-8 flex-1 justify-center">
          {cohortStats.map((c, i) => (
            <div key={i} className="flex flex-col gap-3 group">
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-3"><span className="text-white text-sm font-black tracking-tight uppercase group-hover:text-primary transition-colors">{c.name}</span><span className="text-xs text-gray-500 font-bold tracking-widest">{c.students} Learners</span></div>
                <span className="text-primary text-sm font-black">{c.progress}% AVG</span>
              </div>
              <div className="w-full h-2 rounded-full bg-background-dark overflow-hidden border border-card-border/30"><div className="h-full bg-primary transition-all duration-1000 group-hover:shadow-[0_0_15px_#13ec6a]" style={{width: `${c.progress}%`}}></div></div>
              <div className="flex justify-between text-xs font-black text-gray-600 uppercase tracking-[0.15em]"><span>Current: Module 4</span><span>{c.attendance}% Daily Attendance</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
