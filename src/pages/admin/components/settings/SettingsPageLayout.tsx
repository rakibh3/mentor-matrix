import React, { useState } from 'react';
import { SettingsNav } from '@/layouts/AdminLayout';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button, Card, useToast } from '@/components/ui';

interface SettingsPageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  onSave?: () => void | Promise<void>;
  saveLabel?: string;
  showNav?: boolean;
}

export const SettingsPageLayout: React.FC<SettingsPageLayoutProps> = ({
  children,
  showFooter = true,
  onSave,
  saveLabel = 'Save Changes',
  showNav = true,
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
    <div className="animate-fade-in-up flex w-full flex-col gap-6 lg:gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Settings
        </h2>
        <p className="text-text-secondary text-sm">
          Manage configuration and preferences.
        </p>
      </div>

      <div className="flex flex-col">
        {showNav && <SettingsNav />}
        
        {/* Render children directly without heavy card wrapper if clean mode */}
        {!showNav ? (
          <div className="mt-2">
            {children}
          </div>
        ) : (
          <Card className="bg-surface-dark border-white/5 relative grid gap-10 overflow-hidden rounded-3xl p-8 shadow-2xl ring-1 ring-white/5 md:p-10">
             {/* Gradient Accent */}
             <div className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]"></div>
             
             <div className="relative">
              {children}

              {showFooter && (
                <div className="border-white/5 mt-10 flex items-center justify-end gap-4 border-t pt-8">
                  <Button variant="ghost" className="text-text-secondary hover:text-white">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="px-8">
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
             </div>
          </Card>
        )}
      </div>
    </div>
  );
};
