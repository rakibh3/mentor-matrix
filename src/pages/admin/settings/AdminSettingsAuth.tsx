
import React, { useState } from 'react';
import { AdminLayout, SettingsNav } from '@/layout/AdminLayout';
import { Icon, CustomSelect } from '@/constants';

interface AdminSettingsAuthProps {
  onLogout: () => void;
}

const AdminSettingsAuth: React.FC<AdminSettingsAuthProps> = ({ onLogout }) => {
  const [settings, setSettings] = useState({
    requireOtp: true,
    restrictIps: false,
    autoLogout: true,
    otpExpiry: '5 Minutes'
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExpiryChange = (val: string) => {
    setSettings(prev => ({ ...prev, otpExpiry: val }));
  };

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
            <div className="grid gap-8">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="key" className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">OTP Configuration</h3>
                  <p className="text-sm text-text-secondary font-medium">Control the security of student and admin logins.</p>
                </div>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">OTP Expiry Duration</label>
                  <CustomSelect 
                    value={settings.otpExpiry}
                    options={["5 Minutes", "10 Minutes", "20 Minutes"]}
                    onChange={handleExpiryChange}
                    icon="timer"
                  />
                </div>
                <div className="space-y-3 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Max Login Attempts</label>
                  <input type="number" className="w-full rounded-xl border border-card-border bg-background-dark/50 text-white h-14 px-5 text-sm font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" defaultValue="3"/>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div 
                    className="bg-background-dark/40 border border-card-border rounded-2xl p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => toggleSetting('requireOtp')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center border transition-colors ${settings.requireOtp ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        <Icon name="verified_user" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black text-white uppercase tracking-tight">Require OTP for every login</label>
                        <p className="text-xs text-text-secondary font-medium">Verify identity via secure code every time sign-in occurs.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked={settings.requireOtp} onChange={() => {}} className="sr-only peer" type="checkbox"/>
                      <div className="w-14 h-8 bg-card-border border border-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:start-[6px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:bg-background-dark shadow-lg"></div>
                    </label>
                  </div>

                  <div 
                    className="bg-background-dark/40 border border-card-border rounded-2xl p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => toggleSetting('restrictIps')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center border transition-colors ${settings.restrictIps ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        <Icon name="lan" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black text-white uppercase tracking-tight">IP Access Restriction</label>
                        <p className="text-xs text-text-secondary font-medium">Only allow logins from approved IP address ranges.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked={settings.restrictIps} onChange={() => {}} className="sr-only peer" type="checkbox"/>
                      <div className="w-14 h-8 bg-card-border border border-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:start-[6px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:bg-background-dark shadow-lg"></div>
                    </label>
                  </div>

                  <div 
                    className="bg-background-dark/40 border border-card-border rounded-2xl p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => toggleSetting('autoLogout')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center border transition-colors ${settings.autoLogout ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        <Icon name="logout" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-black text-white uppercase tracking-tight">Automatic Session Expiry</label>
                        <p className="text-xs text-text-secondary font-medium">Log out users automatically after 2 hours of inactivity.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked={settings.autoLogout} onChange={() => {}} className="sr-only peer" type="checkbox"/>
                      <div className="w-14 h-8 bg-card-border border border-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-primary after:content-[''] after:absolute after:top-1 after:start-[6px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:bg-background-dark shadow-lg"></div>
                    </label>
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

export default AdminSettingsAuth;
