import React from 'react';
import { Icon } from '@/constants';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { PrimaryButton } from '@/components/shared/Button';
import { FormInput, FormProvider, useZodForm, type FieldErrors } from '@/components/shared/Form';

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
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (user?.smtpConfig) {
      reset({
        appPassword: user.smtpConfig.appPassword || '',
      });
    }
  }, [user, reset]);

  const handleSubmit = (data: SrmSettingsInput) => {
    console.log('SRM Settings - Validation Success, Mutating:', data);
    updateProfileMutation.mutate({
      smtpConfig: {
        appPassword: data.appPassword,
      },
    });
  };

  const handleFormError = (err: FieldErrors<SrmSettingsInput>) => {
    console.error('SRM Settings - Validation Errors:', err);
  };

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <SettingsPageLayout showNav={false} showFooter={false}>
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center gap-4">
          <Link
            to="/srm/dashboard"
            className="hover:bg-white/5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 text-gray-400 transition-all hover:text-white"
          >
            <Icon name="arrow_back" />
          </Link>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Email Integration
            </h3>
            <p className="text-text-secondary text-sm">
              Connect your professional email account for direct student communication.
            </p>
          </div>
        </div>

        <FormProvider {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit, handleFormError)} 
            className="flex flex-col gap-8"
          >
             <div className="bg-surface-dark w-full overflow-hidden rounded-xl border border-white/5 shadow-sm lg:grid lg:grid-cols-2">
                {/* Left Side: Form */}
                <div className="p-8 lg:p-10">
                  <div className="space-y-8">
                    <div className="space-y-6">
                        <div className="relative">
                          <FormInput
                            label="Gmail App Password"
                            id="app-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your 16-digit app password"
                            error={errors.appPassword?.message}
                            className="bg-background-dark border-white/10 h-12 w-full pr-12 focus:border-primary/50"
                            {...register('appPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="hover:text-primary absolute right-4 top-[42px] text-gray-400 transition-colors"
                          >
                            <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-xl" />
                          </button>
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
          </form>
        </FormProvider>
      </div>
    </SettingsPageLayout>
  );
};

export default SrmSettings;
