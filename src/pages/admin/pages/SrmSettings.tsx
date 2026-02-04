import React from 'react';
import { Icon } from '@/constants';
import { z } from 'zod';
import { PrimaryButton } from '@/components/shared/Button';
import { Form, FormInput, useZodForm } from '@/components/shared/Form';

import { useAuth } from '@/hooks/useAuth';
import { SettingsPageLayout } from '@/pages/admin/components/settings/SettingsPageLayout';
import { useUpdateMyProfile } from '@/pages/admin/hooks/useSrmSettings';

const srmSettingsSchema = z.object({
  appPassword: z.string().min(1, 'App password is required'),
});

type SrmSettingsInput = z.infer<typeof srmSettingsSchema>;

const SrmSettings: React.FC = () => {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateMyProfile();

  const form = useZodForm<SrmSettingsInput>({
    schema: srmSettingsSchema,
    defaultValues: {
      appPassword: user?.smtpConfig?.appPassword || '',
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const handleSubmit = (data: SrmSettingsInput) => {
    updateProfileMutation.mutate({
      smtpConfig: {
        appPassword: data.appPassword,
      },
    });
  };

  return (
    <SettingsPageLayout showNav={false}>
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Email Integration
          </h3>
          <p className="text-text-secondary text-base">
            Connect your professional email account for direct student communication.
          </p>
        </div>

        <Form form={form} onSubmit={handleSubmit} className="flex flex-col gap-8">
           <div className="bg-surface-dark w-full overflow-hidden rounded-xl border border-white/5 shadow-sm lg:grid lg:grid-cols-2">
              {/* Left Side: Form */}
              <div className="p-8 lg:p-10">
                <div className="space-y-8">
                  <div className="space-y-6">
                      <div>
                        <FormInput
                          label="Gmail App Password"
                          id="app-password"
                          type="password"
                          placeholder="Enter your 16-digit app password"
                          error={errors.appPassword?.message}
                          className="bg-background-dark border-white/10 h-12 w-full focus:border-primary/50"
                          {...register('appPassword')}
                        />
                        <p className="text-text-secondary mt-3 text-xs leading-relaxed">
                          You need to generate a specific <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">App Password</a> from your Google Account.
                        </p>
                      </div>
                  </div>
                </div>
              </div>

               {/* Right Side: Info Panel */}
              <div className="bg-surface-dark/50 flex flex-col justify-center border-t border-white/5 p-8 lg:border-t-0 lg:border-l lg:bg-white/[0.02] lg:p-10">
                  <div className="mb-6 flex items-center gap-3 text-primary">
                    <Icon name="info" className="text-xl" />
                    <h4 className="text-sm font-bold tracking-wide uppercase">How it works</h4>
                  </div>
                  <div className="space-y-5 text-sm leading-relaxed text-gray-400">
                    <p>
                      The system sends emails <strong className="text-white">directly</strong> using your Gmail credentials.
                    </p>
                    <div className="h-px w-full bg-white/5"></div>
                    <p>
                      This ensures that emails appear to come directly from you, and student replies will go straight to your inbox without any intermediaries.
                    </p>
                  </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <PrimaryButton
                type="submit"
                loading={updateProfileMutation.isPending}
                className="h-11 px-8 text-sm font-bold tracking-wide uppercase"
              >
                Save Changes
              </PrimaryButton>
              {updateProfileMutation.isSuccess && (
                <span className="animate-in fade-in slide-in-from-left-2 flex items-center gap-2 text-sm font-medium text-emerald-400">
                  <Icon name="check_circle" /> Saved
                </span>
              )}
            </div>
        </Form>
      </div>
    </SettingsPageLayout>
  );
};

export default SrmSettings;
