import React from 'react';
import { Icon } from '@/constants';

import { Badge, Card, CardContent, IconAvatar } from '@/components/ui';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  trend: string;
  color: 'primary' | 'red-500';
}

import { useDashboardStats } from '@/api/hooks/analytics';
 
 export const StatCards: React.FC = () => {
   const { data: dashboardData } = useDashboardStats();
   const statsData = dashboardData?.data;

   // Default values
   const totalStudents = statsData?.students?.totalStudents || 0;
   const presentToday = statsData?.attendance?.presentToday || 0;
   const absentToday = statsData?.attendance?.absentToday || 0;
   const attendanceRate = statsData?.attendance?.attendanceRate || 0;

   const stats: Stat[] = [
     { label: 'Total Enrolled', value: totalStudents, icon: 'groups', trend: '', color: 'primary' },
     { label: 'Present Today', value: presentToday, icon: 'how_to_reg', trend: '', color: 'primary' },
     { label: 'Absent/Late', value: absentToday, icon: 'person_off', trend: '', color: 'red-500' },
     { label: 'Avg Attendance', value: `${attendanceRate}%`, icon: 'auto_graph', trend: '', color: 'primary' },
   ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`rounded-[2rem] bg-[#0c1611] hover:border-${stat.color === 'primary' ? 'primary' : 'red-500'}/30 group transition-all`}
        >
          <CardContent className="flex flex-col gap-4 p-6 pt-6">
            <div className="flex items-start justify-between">
              <IconAvatar
                variant={stat.color === 'primary' ? 'primary' : 'danger'}
                size="md"
                bordered={false}
                className="transition-transform group-hover:scale-110"
              >
                <Icon name={stat.icon} className="text-2xl" />
              </IconAvatar>
              <Badge variant={stat.color === 'primary' ? 'primary' : 'danger'}>{stat.trend}</Badge>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-black tracking-[0.2em] uppercase">
                {stat.label}
              </p>
              <h3 className="mt-1 text-4xl font-black tracking-tighter text-white">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
