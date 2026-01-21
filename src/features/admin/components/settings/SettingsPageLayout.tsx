import React, { useState } from 'react';
import { AdminLayout, SettingsNav } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';

interface SettingsPageLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
  showFooter?: boolean;
  onSave?: () => void | Promise<void>;
  saveLabel?: string;
}

export const SettingsPageLayout: React.FC<SettingsPageLayoutProps> = ({
  onLogout,
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
    <AdminLayout onLogout={onLogout}>
      <div className="w-full flex flex-col gap-8 animate-fade-in-up">
        <div className="flex flex-col gap-2 border-b border-card-border pb-8">
          <h2 className="text-white text-4xl font-black leading-tight tracking-tighter uppercase">
            System Settings
          </h2>
          <p className="text-text-secondary text-base font-medium">
            Manage global configuration for attendance tracking and portal access.
          </p>
        </div>
        <div className="flex flex-col">
          <SettingsNav />
          <Card className="grid gap-10 rounded-3xl p-10 md:p-12 shadow-2xl">
            {children}

            {showFooter && (
              <div className="flex items-center justify-end gap-6 pt-10 border-t border-card-border/50">
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
    </AdminLayout>
  );
};
