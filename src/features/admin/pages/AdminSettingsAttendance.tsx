import React, { useState } from 'react';
import { Icon } from '@/constants';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { SettingToggleCard } from '@/components/ui/setting-toggle-card';
import { SettingsPageLayout } from '@/features/admin/components/settings/SettingsPageLayout';

interface AdminSettingsAttendanceProps {
  onLogout: () => void;
}

const AdminSettingsAttendance: React.FC<AdminSettingsAttendanceProps> = ({ onLogout }) => {
  const [attendanceWindow, setAttendanceWindow] = useState(4);
  const [gracePeriod, setGracePeriod] = useState(15);

  return (
    <SettingsPageLayout onLogout={onLogout}>
      <div className="grid gap-12">
        <div className="flex items-center gap-4">
          <IconAvatar size="md" bordered={false}>
            <Icon name="event_repeat" className="text-2xl" />
          </IconAvatar>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Attendance Rules</h3>
            <p className="text-sm text-text-secondary font-medium">Define how and when student attendance is recorded.</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-window">Attendance Window (Hours)</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  id="attendance-window"
                  name="attendance-window"
                  min={1} 
                  max={12} 
                  step={1}
                  value={[attendanceWindow]} 
                  onValueChange={(val) => setAttendanceWindow(val[0])} 
                  className="flex-1"
                />
                <span className="text-xl font-black text-primary w-12 text-center">{attendanceWindow}h</span>
              </div>
              <p className="text-xs text-text-secondary italic">Maximum time after session start for check-in.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="grace-period">Grace Period (Minutes)</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  id="grace-period"
                  name="grace-period"
                  min={0} 
                  max={60} 
                  step={5}
                  value={[gracePeriod]} 
                  onValueChange={(val) => setGracePeriod(val[0])} 
                  className="flex-1"
                />
                <span className="text-xl font-black text-primary w-12 text-center">{gracePeriod}m</span>
              </div>
              <p className="text-xs text-text-secondary italic">Time allowed for check-in before being marked 'Late'.</p>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <SettingToggleCard
              layout="vertical"
              icon={<Icon name="notifications_active" />}
              iconVariant="primary"
              title="Daily Reminders"
              description="Send Slack/Email notifications to students who haven't checked in yet."
              checked={true}
              onCheckedChange={() => {}}
              disabled
            />

            <SettingToggleCard
              layout="vertical"
              icon={<Icon name="auto_mode" />}
              iconVariant="danger"
              title="Auto-Mark Absent"
              description="Automatically mark students absent after the attendance window closes."
              checked={false}
              onCheckedChange={() => {}}
              disabled
            />
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default AdminSettingsAttendance;
