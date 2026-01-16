
import React, { useState } from 'react';
import { AdminLayout } from '@/layout/AdminLayout';
import { Icon, CustomSelect } from '@/constants';

interface AdminAnalyticsProps {
  onLogout: () => void;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ onLogout }) => {
  const [timePeriod, setTimePeriod] = useState('Last 30 Days');

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="w-full flex flex-col gap-8 selection:bg-primary/30 animate-fade-in-up">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-3xl font-black leading-tight tracking-tight uppercase">Analytics Dashboard</h2>
            <p className="text-text-secondary text-base">Insights for Full Stack Web Dev (Cohort 12)</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background-dark font-black h-10 px-6 rounded-xl text-sm transition-all shadow-lg shadow-primary/20 active:scale-95">
              <Icon name="download" className="text-lg" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card-dark border border-card-border p-5 rounded-2xl flex flex-col gap-4 shadow-xl transition-all hover:border-primary/30 group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                <Icon name="trending_up" />
              </div>
              <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">+2.4%</span>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Average Progress</p>
              <h3 className="text-white text-3xl font-black mt-1">68.2%</h3>
            </div>
          </div>
          <div className="bg-card-dark border border-card-border p-5 rounded-2xl flex flex-col gap-4 shadow-xl transition-all hover:border-primary/30 group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                <Icon name="group_add" />
              </div>
              <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Top</span>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Highest Attendance</p>
              <h3 className="text-white text-3xl font-black mt-1 uppercase tracking-tight">Cohort 10</h3>
              <p className="text-xs text-text-secondary mt-1 font-bold">98% Daily Avg</p>
            </div>
          </div>
          <div className="bg-card-dark border border-card-border p-5 rounded-2xl flex flex-col gap-4 shadow-xl transition-all hover:border-red-500/30 group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-red-500/10 rounded-lg text-red-400 group-hover:scale-110 transition-transform">
                <Icon name="warning" />
              </div>
              <span className="text-xs font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-full uppercase tracking-widest">High Risk</span>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Dropout Risk</p>
              <h3 className="text-white text-3xl font-black mt-1">12 Students</h3>
              <p className="text-xs text-text-secondary mt-1 font-bold">&lt; 40% Attendance</p>
            </div>
          </div>
          <div className="bg-card-dark border border-card-border p-5 rounded-2xl flex flex-col gap-4 shadow-xl transition-all hover:border-primary/30 group">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                <Icon name="assignment" />
              </div>
              <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">+125</span>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-black uppercase tracking-widest">Submissions</p>
              <h3 className="text-white text-3xl font-black mt-1">1,248</h3>
              <p className="text-xs text-text-secondary mt-1 font-bold tracking-tight">Last 7 days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card-dark border border-card-border rounded-2xl p-8 shadow-2xl flex flex-col h-96 relative overflow-hidden group/chart">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div>
                <h3 className="text-white font-black text-xl uppercase tracking-tight">Attendance Trends</h3>
                <p className="text-text-secondary text-xs font-black uppercase tracking-widest mt-1">Performance over time</p>
              </div>
              <div className="w-48">
                <CustomSelect 
                  value={timePeriod}
                  options={["Last 7 Days", "Last 30 Days", "Last 3 Months", "Year to Date"]}
                  onChange={setTimePeriod}
                />
              </div>
            </div>
            <div className="flex-1 relative flex items-end justify-between gap-1.5 px-2 pb-6 border-b border-l border-card-border/50 pt-4">
              {[40, 55, 62, 58, 75, 82, 78, 85, 88, 80, 92, 95, 91, 94, 96, 92, 88, 85, 89, 93].map((h, i) => (
                <div key={i} className="w-[4%] bg-primary/10 hover:bg-primary/50 rounded-t-lg transition-all group relative cursor-pointer" style={{height: `${h}%`}}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-dark border border-card-border text-primary text-xs font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap z-20 shadow-xl">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 bg-card-dark border border-card-border rounded-2xl p-8 shadow-2xl flex flex-col h-96 relative overflow-hidden group/dist">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
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
                  <div className="h-2 w-full bg-background-dark/50 rounded-full overflow-hidden border border-card-border/30">
                    <div className={`h-full ${m.color} rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(19,236,106,0.3)]`} style={{width: `${m.p}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
