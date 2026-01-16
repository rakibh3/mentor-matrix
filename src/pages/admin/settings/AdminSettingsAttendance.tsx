
import React from 'react';
import { AdminLayout, SettingsNav } from '@/layout/AdminLayout';
import { Icon } from '@/constants';

interface AdminSettingsAttendanceProps {
  onLogout: () => void;
}

const AdminSettingsAttendance: React.FC<AdminSettingsAttendanceProps> = ({ onLogout }) => {
  return (
    <AdminLayout onLogout={onLogout}>
      <div className="w-full flex flex-col gap-8 animate-fade-in-up">
        <div className="flex flex-col gap-2 border-b border-card-border pb-8">
          <h2 className="text-white text-4xl font-black leading-tight tracking-tighter uppercase">System Settings</h2>
          <p className="text-text-secondary text-base font-medium">Manage global configuration for attendance tracking and portal access.</p>
        </div>
        <div className="flex flex-col">
          <SettingsNav />
          <div className="grid gap-10 bg-card-dark border border-card-border rounded-3xl p-10 md:p-12 shadow-2xl">
            <div className="grid gap-12">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="event_repeat" className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Attendance Rules</h3>
                  <p className="text-sm text-text-secondary font-medium">Define how and when student attendance is recorded.</p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Attendance Window (Hours)</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="1" max="12" defaultValue="4" className="flex-1 accent-primary h-2 bg-background-dark rounded-full cursor-pointer" />
                      <span className="text-xl font-black text-primary w-12 text-center">4h</span>
                    </div>
                    <p className="text-xs text-text-secondary italic">Maximum time after session start for check-in.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Grace Period (Minutes)</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="0" max="60" defaultValue="15" step="5" className="flex-1 accent-primary h-2 bg-background-dark rounded-full cursor-pointer" />
                      <span className="text-xl font-black text-primary w-12 text-center">15m</span>
                    </div>
                    <p className="text-xs text-text-secondary italic">Time allowed for check-in before being marked 'Late'.</p>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 rounded-2xl bg-background-dark/40 border border-card-border flex flex-col gap-3 group">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon name="notifications_active" />
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input checked readOnly className="sr-only peer" type="checkbox"/>
                        <div className="w-12 h-7 bg-card-border border border-card-border rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:start-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-background-dark shadow-lg"></div>
                      </label>
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Daily Reminders</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">Send Slack/Email notifications to students who haven't checked in yet.</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-background-dark/40 border border-card-border flex flex-col gap-3 group">
                    <div className="flex items-center justify-between">
                      <div className="size-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                        <Icon name="auto_mode" />
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input readOnly className="sr-only peer" type="checkbox"/>
                        <div className="w-12 h-7 bg-card-border border border-card-border rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:start-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-background-dark shadow-lg"></div>
                      </label>
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Auto-Mark Absent</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">Automatically mark students absent after the attendance window closes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-6 pt-10 border-t border-card-border/50">
              <button className="px-8 h-14 rounded-2xl border border-card-border text-xs font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white hover:bg-white/5 transition-all">Cancel</button>
              <button className="px-10 h-14 rounded-2xl bg-primary text-background-dark font-black uppercase tracking-[0.2em] hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsAttendance;
