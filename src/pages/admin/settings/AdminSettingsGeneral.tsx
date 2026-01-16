import React, { useState } from 'react';
import { AdminLayout, SettingsNav } from '@/layout/AdminLayout';
import { Icon, CustomSelect } from '@/constants';
import { useToast } from '@/context/ToastContext';

interface AdminSettingsGeneralProps {
  onLogout: () => void;
}

const AdminSettingsGeneral: React.FC<AdminSettingsGeneralProps> = ({ onLogout }) => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [timezone, setTimezone] = useState('(GMT-05:00) Eastern Time (US & Canada)');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({
        type: 'success',
        title: 'Settings Synchronized',
        message: 'Portal configuration has been successfully updated across all modules.'
      });
    }, 1200);
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
          <div className="grid gap-10 bg-card-dark border border-card-border rounded-3xl p-10 md:p-12 shadow-2xl relative">
            
            <div className="grid gap-8">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="info" className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">General Information</h3>
                  <p className="text-sm text-text-secondary font-medium">Basic details about this bootcamp instance.</p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Bootcamp Name</label>
                  <input className="w-full rounded-xl border border-card-border bg-background-dark/50 text-white h-14 px-5 text-sm font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" defaultValue="Full Stack Web Dev (Cohort 12)"/>
                </div>
                <div className="space-y-3 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">System Timezone</label>
                  <CustomSelect 
                    value={timezone}
                    options={[
                      '(GMT-05:00) Eastern Time (US & Canada)',
                      '(GMT-08:00) Pacific Time (US & Canada)',
                      '(GMT+00:00) London',
                      '(GMT+05:30) Mumbai'
                    ]}
                    onChange={setTimezone}
                  />
                </div>
                <div className="md:col-span-2 space-y-3 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Portal Description</label>
                  <textarea className="w-full rounded-xl border border-card-border bg-background-dark/50 text-white h-32 p-5 text-sm font-medium outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" defaultValue="Official portal for tracking student progress, managing attendance, and delivering daily curriculum content across all cohorts."/>
                </div>
              </div>
            </div>

            <div className="grid gap-8 pt-4 border-t border-card-border/30">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="branding_watermark" className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Branding</h3>
                  <p className="text-sm text-text-secondary font-medium">Customize the visual appearance of the portal.</p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 rounded-2xl bg-background-dark/50 border border-card-border flex flex-col items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all">
                  <div className="size-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                    <Icon name="upload" className="text-2xl" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Upload Logo</span>
                </div>
                <div className="p-6 rounded-2xl bg-background-dark/50 border border-card-border flex flex-col items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all">
                  <div className="size-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                    <Icon name="favicon" className="text-2xl" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Upload Favicon</span>
                </div>
                <div className="p-6 rounded-2xl bg-background-dark/50 border border-card-border flex flex-col items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all">
                  <div className="flex gap-2">
                    <div className="size-6 rounded-full bg-primary"></div>
                    <div className="size-6 rounded-full bg-background-dark border border-white/20"></div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Primary Color</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6 pt-10 border-t border-card-border/50">
              <button className="px-8 h-14 rounded-2xl border border-card-border text-xs font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white hover:bg-white/5 transition-all">Cancel</button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-10 h-14 rounded-2xl bg-primary text-background-dark font-black uppercase tracking-[0.2em] hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="size-4 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsGeneral;