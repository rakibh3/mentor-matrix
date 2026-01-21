import React, { useState } from 'react';
import { Icon } from '@/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { UploadCard } from '@/components/ui/upload-card';
import { SettingsPageLayout } from '@/features/admin/components/settings/SettingsPageLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminSettingsGeneralProps {
  onLogout: () => void;
}

const AdminSettingsGeneral: React.FC<AdminSettingsGeneralProps> = ({ onLogout }) => {
  const [timezone, setTimezone] = useState('(GMT-05:00) Eastern Time (US & Canada)');

  return (
    <SettingsPageLayout onLogout={onLogout}>
      <div className="grid gap-8">
        <div className="flex items-center gap-4">
          <IconAvatar size="md" bordered={false}>
            <Icon name="info" className="text-2xl" />
          </IconAvatar>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">General Information</h3>
            <p className="text-sm text-text-secondary font-medium">Basic details about this bootcamp instance.</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="bootcamp-name">Bootcamp Name</Label>
            <Input id="bootcamp-name" name="bootcamp-name" className="rounded-xl" defaultValue="Full Stack Web Dev (Cohort 12)"/>
          </div>
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="system-timezone">System Timezone</Label>
            <Select name="timezone" value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="system-timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</SelectItem>
                <SelectItem value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</SelectItem>
                <SelectItem value="(GMT+00:00) London">(GMT+00:00) London</SelectItem>
                <SelectItem value="(GMT+05:30) Mumbai">(GMT+05:30) Mumbai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 space-y-3 flex flex-col">
            <Label htmlFor="portal-description">Portal Description</Label>
            <Textarea id="portal-description" name="portal-description" className="h-32" defaultValue="Official portal for tracking student progress, managing attendance, and delivering daily curriculum content across all cohorts."/>
          </div>
        </div>
      </div>

      <div className="grid gap-8 pt-4 border-t border-card-border/30">
        <div className="flex items-center gap-4">
          <IconAvatar size="md" bordered={false}>
            <Icon name="branding_watermark" className="text-2xl" />
          </IconAvatar>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Branding</h3>
            <p className="text-sm text-text-secondary font-medium">Customize the visual appearance of the portal.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <UploadCard 
            icon={
              <IconAvatar size="md" variant="default" bordered={false} className="rounded-full group-hover:text-primary transition-colors">
                <Icon name="upload" className="text-2xl" />
              </IconAvatar>
            }
            label="Upload Logo"
          />
          <UploadCard 
            icon={
              <IconAvatar size="md" variant="default" bordered={false} className="rounded-full group-hover:text-primary transition-colors">
                <Icon name="favicon" className="text-2xl" />
              </IconAvatar>
            }
            label="Upload Favicon"
          />
          <UploadCard 
            icon={
              <div className="flex gap-2">
                <StatusDot variant="primary" size="lg" />
                <StatusDot variant="inactive" size="lg" className="border border-white/20" />
              </div>
            }
            label="Primary Color"
          />
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default AdminSettingsGeneral;
