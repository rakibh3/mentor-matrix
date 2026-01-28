import React, { useState } from 'react';
import { Icon } from '@/constants';
import { PrimaryButton } from '@/components/shared/Button';
import { BackgroundGlow, Badge, Card, CardContent, IconAvatar, Progress, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';

const AdminAnalytics: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('Last 30 Days');

  return (
    <>
      <div className="w-full flex flex-col gap-8 selection:bg-primary/30 animate-fade-in-up">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-3xl font-black leading-tight tracking-tight uppercase">Analytics Dashboard</h2>
            <p className="text-text-secondary text-base">Insights for Full Stack Web Dev (Cohort 12)</p>
          </div>
          <div className="flex items-center gap-3">
            <PrimaryButton className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background-dark font-black h-10 px-6 rounded-xl text-sm shadow-lg shadow-primary/20 active:scale-95">
              <Icon name="download" className="text-lg" />
              <span>Export Report</span>
            </PrimaryButton>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="transition-all hover:border-primary/30 group">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <IconAvatar variant="primary" size="sm" bordered={false} className="group-hover:scale-110 transition-transform">
                  <Icon name="trending_up" />
                </IconAvatar>
                <Badge variant="primary">+2.4%</Badge>
              </div>
              <div>
                <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Average Progress</p>
                <h3 className="text-white text-3xl font-black mt-1">68.2%</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:border-primary/30 group">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <IconAvatar variant="primary" size="sm" bordered={false} className="group-hover:scale-110 transition-transform">
                  <Icon name="group_add" />
                </IconAvatar>
                <Badge variant="primary">Top</Badge>
              </div>
              <div>
                <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Highest Attendance</p>
                <h3 className="text-white text-3xl font-black mt-1 uppercase tracking-tight">Cohort 10</h3>
                <p className="text-xs text-text-secondary mt-1 font-bold">98% Daily Avg</p>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:border-red-500/30 group">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <IconAvatar variant="danger" size="sm" bordered={false} className="group-hover:scale-110 transition-transform">
                  <Icon name="warning" />
                </IconAvatar>
                <Badge variant="danger">High Risk</Badge>
              </div>
              <div>
                <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Dropout Risk</p>
                <h3 className="text-white text-3xl font-black mt-1">12 Students</h3>
                <p className="text-xs text-text-secondary mt-1 font-bold">&lt; 40% Attendance</p>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:border-primary/30 group">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <IconAvatar variant="primary" size="sm" bordered={false} className="group-hover:scale-110 transition-transform">
                  <Icon name="assignment" />
                </IconAvatar>
                <Badge variant="primary">+125</Badge>
              </div>
              <div>
                <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Submissions</p>
                <h3 className="text-white text-3xl font-black mt-1">1,248</h3>
                <p className="text-xs text-text-secondary mt-1 font-bold tracking-tight">Last 7 days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 h-96 relative overflow-hidden group/chart">
            <CardContent className="p-8 flex flex-col h-full">
              <BackgroundGlow shape="corner-bl" size="sm" blur="none" position="top-right" />
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div>
                  <h3 className="text-white font-black text-xl uppercase tracking-tight">Attendance Trends</h3>
                  <p className="text-text-secondary text-xs font-black uppercase tracking-widest mt-1">Performance over time</p>
                </div>
                <div className="w-48">
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                      <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                      <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                      <SelectItem value="Year to Date">Year to Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-1 relative flex items-end justify-between gap-1.5 px-2 pb-6 border-b border-l border-card-border/50 pt-4">
                {[40, 55, 62, 58, 75, 82, 78, 85, 88, 80, 92, 95, 91, 94, 96, 92, 88, 85, 89, 93].map((h, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="w-[4%] bg-primary/10 hover:bg-primary/50 rounded-t-lg transition-all cursor-pointer" style={{height: `${h}%`}} />
                    </TooltipTrigger>
                    <TooltipContent className="text-primary font-black">{h}%</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1 h-96 relative overflow-hidden group/dist">
            <CardContent className="p-8 flex flex-col h-full">
              <BackgroundGlow shape="corner-bl" size="sm" blur="none" position="top-right" />
              <h3 className="text-white font-black text-xl uppercase tracking-tight mb-8 relative z-10">Module Dist.</h3>
              <div className="flex-1 flex flex-col justify-center gap-6">
                {[
                  { label: 'Frontend Basics', students: 180, p: 45, color: 'bg-primary/40' },
                  { label: 'React & State', students: 120, p: 30, color: 'bg-primary/60' },
                  { label: 'Backend (Node)', students: 90, p: 22, color: 'bg-primary/80' },
                  { label: 'Database', students: 60, p: 15, color: 'bg-primary' },
                ].map((m, idx) => (
                  <div key={idx} className="space-y-3 group/item">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-gray-400 group-hover:text-primary transition-colors">{m.label}</span>
                      <span className="text-text-secondary">{m.students} Students</span>
                    </div>
                    <Progress 
                      value={m.p} 
                      indicatorClassName={`${m.color} group-hover:shadow-[0_0_10px_rgba(19,236,106,0.3)]`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminAnalytics;
