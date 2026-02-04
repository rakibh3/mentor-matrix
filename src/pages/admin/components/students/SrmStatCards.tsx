import React from 'react';
import { Icon } from '@/constants';

import {
  Badge,
  Card,
  CardContent,
  IconAvatar,
} from '@/components/ui';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  trend: string;
  color: string;
}

interface SrmStatCardsProps {
  stats: Stat[];
}

export const SrmStatCards: React.FC<SrmStatCardsProps> = ({ stats }) => {
  return (
    <>
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="bg-card-dark/30 hover:border-primary/20 group rounded-3xl border border-white/5 backdrop-blur-md transition-all duration-300"
        >
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between">
              <IconAvatar
                variant={
                  stat.color === 'primary'
                    ? 'primary'
                    : stat.color === 'red-500'
                      ? 'danger'
                      : 'default'
                }
                size="sm"
                bordered={false}
                className="bg-white/5 transition-transform duration-300 group-hover:scale-110"
              >
                <Icon name={stat.icon} className="text-lg" />
              </IconAvatar>
              <Badge
                variant={
                  stat.color === 'primary'
                    ? 'primary'
                    : stat.color === 'red-500'
                      ? 'danger'
                      : 'default'
                }
                className="h-5 border-white/10 bg-white/5 px-2 py-0 text-[10px] shadow-none"
              >
                {stat.trend}
              </Badge>
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">{stat.value}</h3>
              <p className="text-text-secondary mt-1 text-[10px] font-black tracking-widest uppercase">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
