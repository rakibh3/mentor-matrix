import React, { useState } from 'react';
import { Icon } from '@/constants';
import { IconAvatar, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SettingToggleCard } from '@/components/ui';
import { SettingsPageLayout } from '@/pages/admin/components/settings/SettingsPageLayout';


interface AdminSettingsAuthProps {}

const AdminSettingsAuth: React.FC<AdminSettingsAuthProps> = () => {
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
    <SettingsPageLayout>
      <div className="grid gap-8">
        <div className="flex items-center gap-4">
          <IconAvatar size="md" bordered={false}>
            <Icon name="key" className="text-2xl" />
          </IconAvatar>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">OTP Configuration</h3>
            <p className="text-sm text-text-secondary font-medium">Control the security of student and admin logins.</p>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="otp-expiry">OTP Expiry Duration</Label>
            <Select name="otp-expiry" value={settings.otpExpiry} onValueChange={handleExpiryChange}>
              <SelectTrigger id="otp-expiry" icon="timer">
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5 Minutes">5 Minutes</SelectItem>
                <SelectItem value="10 Minutes">10 Minutes</SelectItem>
                <SelectItem value="20 Minutes">20 Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
            <Input id="max-login-attempts" name="max-login-attempts" type="number" className="rounded-xl" defaultValue="3"/>
          </div>

          <div className="md:col-span-2 space-y-4">
            <SettingToggleCard
              icon={<Icon name="verified_user" />}
              title="Require OTP for every login"
              description="Verify identity via secure code every time sign-in occurs."
              checked={settings.requireOtp}
              onCheckedChange={() => toggleSetting('requireOtp')}
            />

            <SettingToggleCard
              icon={<Icon name="lan" />}
              title="IP Access Restriction"
              description="Only allow logins from approved IP address ranges."
              checked={settings.restrictIps}
              onCheckedChange={() => toggleSetting('restrictIps')}
            />

            <SettingToggleCard
              icon={<Icon name="logout" />}
              title="Automatic Session Expiry"
              description="Log out users automatically after 2 hours of inactivity."
              checked={settings.autoLogout}
              onCheckedChange={() => toggleSetting('autoLogout')}
            />
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default AdminSettingsAuth;
