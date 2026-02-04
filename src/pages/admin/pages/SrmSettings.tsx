import React from 'react';
import { Icon } from '@/constants';
import { z } from 'zod';
import { PrimaryButton } from '@/components/shared/Button';
import { Form, FormInput, useZodForm } from '@/components/shared/Form';
import { IconAvatar } from '@/components/ui';
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
    <SettingsPageLayout>
      <div className="grid gap-8">
        <div className="flex items-center gap-4">
          <IconAvatar variant="primary" size="md" bordered={false}>
            <Icon name="mail" className="text-2xl" />
          </IconAvatar>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white uppercase">
              Email Configuration
            </h3>
            <p className="text-text-secondary text-sm font-medium">
              Configure your reply-to email for outreach emails to students.
            </p>
          </div>
        </div>

        <Form form={form} onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col space-y-3">
            <FormInput
              label="Gmail App Password"
              id="app-password"
              type="password"
              placeholder="xxxx xxxx xxxx xxxx"
              error={errors.appPassword?.message}
              {...register('appPassword')}
            />
            <p className="text-text-secondary/60 mt-1 text-[10px]">
              Use a Gmail App Password to enable outreach emails. You can generate one in your Google Account security settings.
            </p>
          </div>

          <div className="pt-4 md:col-span-2">
            <PrimaryButton
              type="submit"
              loading={updateProfileMutation.isPending}
              className="h-12 w-full px-10 md:w-auto"
            >
              SAVE CONFIGURATION
            </PrimaryButton>
          </div>
        </Form>
      </div>

      <div className="bg-primary/5 border-primary/10 mt-12 rounded-2xl border p-6">
        <div className="flex gap-4">
          <Icon name="info" className="text-primary flex-shrink-0 text-2xl" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">How it works</h4>
            <p className="text-text-secondary text-xs">
              Outreach emails are sent from the system email, but your configured email address will
              be set as the "Reply-To" address. This means when students reply, their responses will
              go directly to your inbox.
            </p>
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default SrmSettings;
