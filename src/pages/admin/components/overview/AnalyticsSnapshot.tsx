import React from 'react';
import { Icon } from '@/constants';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DonutChart,
  IconAvatar,
  Progress,
  StatusDot,
} from '@/components/ui';

interface AnalyticsSnapshotProps {}

import { useAttendanceTrends } from '@/api/hooks/analytics';
import { useDashboardStats } from '@/api/hooks/analytics';

export const AnalyticsSnapshot: React.FC<AnalyticsSnapshotProps> = () => {
    const { data: trendData } = useAttendanceTrends(3);
    const { data: dashboardData } = useDashboardStats();
    
    // Format trends
    const trends = trendData?.data?.map(t => ({
        date: new Date(t.date).toLocaleDateString('en-US', { weekday: 'long' }),
        rawDate: t.date,
        percentage: Math.round(t.attendanceRate),
        count: t.totalPresent
    })).sort((a,b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()) || [
        { date: 'Today', percentage: 0, count: 0 },
        { date: 'Yesterday', percentage: 0, count: 0 },
        { date: '2 Days Ago', percentage: 0, count: 0 },
    ];

    const todayRate = dashboardData?.data?.attendance?.attendanceRate || 0;
    const presentCount = dashboardData?.data?.attendance?.presentToday || 0;
    const absentCount = dashboardData?.data?.attendance?.absentToday || 0;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <Card className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl lg:col-span-6">
        <div className="from-primary/50 absolute top-0 left-0 h-1 w-full bg-gradient-to-r to-transparent"></div>
        <CardHeader className="flex flex-col items-center gap-2 p-10 pb-0 text-center">
          <CardTitle>Today's Snapshot</CardTitle>
          <CardDescription className="tracking-widest uppercase">
            Attendance Distribution Across Cohorts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8 p-10 pt-8">
          <DonutChart
            segments={[
              { value: todayRate, className: 'stroke-primary' },
              { value: 100 - todayRate, className: 'stroke-red-500/30' },
            ]}
            size="xl"
          >
            <span className="text-5xl font-black tracking-tighter text-white">{todayRate}%</span>
            <span className="text-primary text-xs font-black tracking-widest uppercase">
              On Track
            </span>
          </DonutChart>
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="bg-background-dark/50 border-card-border flex items-center gap-4 rounded-2xl border p-5">
              <StatusDot variant="primary" size="md" glow />
              <div className="flex flex-col">
                <span className="text-lg leading-none font-black text-white">{presentCount}</span>
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Present On Time
                </span>
              </div>
            </div>
            <div className="bg-background-dark/50 border-card-border flex items-center gap-4 rounded-2xl border p-5">
              <StatusDot variant="danger" size="md" glow />
              <div className="flex flex-col">
                <span className="text-lg leading-none font-black text-white">{absentCount}</span>
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Absent Today
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden rounded-[2.5rem] shadow-2xl lg:col-span-6">
        <div className="from-primary/50 absolute top-0 right-0 h-1 w-full bg-gradient-to-l to-transparent"></div>
        <CardHeader className="flex flex-row items-center justify-between p-10 pb-0">
          <div>
            <CardTitle>Last 3 Days Attendance</CardTitle>
            <CardDescription className="mt-1 tracking-widest uppercase">
              Recent participation trends
            </CardDescription>
          </div>
          <IconAvatar size="md">
            <Icon name="history" className="text-2xl" />
          </IconAvatar>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 p-10 pt-8">
          {trends.slice(0,3).map((day, i) => (
            <div key={i} className="group flex flex-col gap-3">
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <span className="group-hover:text-primary text-sm font-black tracking-tight text-white uppercase transition-colors">
                    {day.date}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-primary text-sm font-black">{day.percentage}%</span>
                    <span className="text-[10px] font-bold tracking-widest text-gray-500">{day.count} Present</span>
                </div>
              </div>
              <Progress
                value={day.percentage}
                className="h-2"
                indicatorClassName="group-hover:shadow-[0_0_15px_#13ec6a]"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
