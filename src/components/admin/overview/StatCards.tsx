
import React from 'react';
import { Icon } from '@/constants';

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
        <div key={i} className={`bg-[#0c1611] border border-card-border p-6 rounded-[2rem] flex flex-col gap-4 shadow-xl hover:border-${stat.color === 'primary' ? 'primary' : 'red-500'}/30 transition-all group`}>
          <div className="flex justify-between items-start">
            <div className={`size-12 rounded-2xl ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon name={stat.icon} className="text-2xl" />
            </div>
            <span className={`text-xs font-black ${stat.color === 'primary' ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-500/10'} px-3 py-1 rounded-full uppercase tracking-widest`}>{stat.trend}</span>
          </div>
          <div>
            <p className="text-text-secondary text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <h3 className="text-white text-4xl font-black mt-1 tracking-tighter">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
