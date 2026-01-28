
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

export const StatCards: React.FC = () => {
  const stats: Stat[] = [
    { label: 'Total Enrolled', value: 154, icon: 'groups', trend: '+12%', color: 'primary' },
    { label: 'Present Today', value: 142, icon: 'how_to_reg', trend: '92%', color: 'primary' },
    { label: 'Absent/Late', value: 12, icon: 'person_off', trend: 'Risk', color: 'red-500' },
    { label: 'Avg Progress', value: '72%', icon: 'auto_graph', trend: '+4%', color: 'primary' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card 
          key={i} 
          className={`bg-[#0c1611] rounded-[2rem] hover:border-${stat.color === 'primary' ? 'primary' : 'red-500'}/30 transition-all group`}
        >
          <CardContent className="p-6 pt-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <IconAvatar variant={stat.color === 'primary' ? 'primary' : 'danger'} size="md" bordered={false} className="group-hover:scale-110 transition-transform">
                <Icon name={stat.icon} className="text-2xl" />
              </IconAvatar>
              <Badge variant={stat.color === 'primary' ? 'primary' : 'danger'}>{stat.trend}</Badge>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-white text-4xl font-black mt-1 tracking-tighter">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
