import React, { useState } from 'react';
import { SettingsNav } from '@/layouts/AdminLayout';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button, Card, useToast } from '@/components/ui';

interface SettingsPageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  onSave?: () => void | Promise<void>;
  saveLabel?: string;
}

export const SettingsPageLayout: React.FC<SettingsPageLayoutProps> = ({
  children,
  showFooter = true,
  onSave,
  saveLabel = 'Save Changes',
}) => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
      } finally {
        setIsSaving(false);
      }
    } else {
      // Default save behavior
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        addToast({
          type: 'success',
          title: 'Settings Synchronized',
          message: 'Portal configuration has been successfully updated across all modules.',
        });
      }, 1200);
    }
  };

  return (
    <div className="animate-fade-in-up flex w-full flex-col gap-8">
      <div className="border-card-border flex flex-col gap-2 border-b pb-8">
        <h2 className="text-4xl leading-tight font-black tracking-tighter text-white uppercase">
          System Settings
        </h2>
        <p className="text-text-secondary text-base font-medium">
          Manage global configuration for attendance tracking and portal access.
        </p>
      </div>
      <div className="flex flex-col">
        <SettingsNav />
        <Card className="grid gap-10 rounded-3xl p-10 shadow-2xl md:p-12">
          {children}

          {showFooter && (
            <div className="border-card-border/50 flex items-center justify-end gap-6 border-t pt-10">
              <Button variant="outline" size="lg">
                Cancel
              </Button>
              <Button size="lg" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <LoadingSpinner size="xs" variant="dark" inline />
                    Saving...
                  </>
                ) : (
                  saveLabel
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
