
import React from 'react';
import { Icon } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, DonutChart, IconAvatar, Progress, StatusDot } from '@/components/ui';





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
      <Card className="lg:col-span-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        <CardHeader className="flex flex-col items-center text-center gap-2 p-10 pb-0">
          <CardTitle>Today's Snapshot</CardTitle>
          <CardDescription className="uppercase tracking-widest">Attendance Distribution Across Cohorts</CardDescription>
        </CardHeader>
        <CardContent className="p-10 pt-8 flex flex-col items-center gap-8">
          <DonutChart 
            segments={[
              { value: 92, className: "stroke-primary" },
              { value: 8, className: "stroke-red-500/30" }
            ]}
            size="xl"
          >
            <span className="text-5xl font-black text-white tracking-tighter">92%</span>
            <span className="text-xs font-black text-primary uppercase tracking-widest">On Track</span>
          </DonutChart>
          <div className="grid grid-cols-2 w-full gap-4">
            <div className="flex items-center gap-4 p-5 bg-background-dark/50 rounded-2xl border border-card-border">
              <StatusDot variant="primary" size="md" glow />
              <div className="flex flex-col"><span className="text-white text-lg font-black leading-none">142</span><span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Present On Time</span></div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-background-dark/50 rounded-2xl border border-card-border">
              <StatusDot variant="danger" size="md" glow />
              <div className="flex flex-col"><span className="text-white text-lg font-black leading-none">12</span><span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Absent Today</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-primary/50 to-transparent"></div>
        <CardHeader className="p-10 pb-0 flex flex-row justify-between items-center">
          <div>
            <CardTitle>Cohort Comparison</CardTitle>
            <CardDescription className="uppercase tracking-widest mt-1">Relative performance index</CardDescription>
          </div>
          <IconAvatar size="md"><Icon name="compare_arrows" className="text-2xl" /></IconAvatar>
        </CardHeader>
        <CardContent className="p-10 pt-8 flex flex-col gap-8">
          {cohortStats.map((c, i) => (
            <div key={i} className="flex flex-col gap-3 group">
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-3"><span className="text-white text-sm font-black tracking-tight uppercase group-hover:text-primary transition-colors">{c.name}</span><span className="text-xs text-gray-500 font-bold tracking-widest">{c.students} Learners</span></div>
                <span className="text-primary text-sm font-black">{c.progress}% AVG</span>
              </div>
              <Progress value={c.progress} className="h-2" indicatorClassName="group-hover:shadow-[0_0_15px_#13ec6a]" />
              <div className="flex justify-between text-xs font-black text-gray-600 uppercase tracking-[0.15em]"><span>Current: Module 4</span><span>{c.attendance}% Daily Attendance</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
