/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Icon } from '@/constants';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

import * as auth from '@/api/endpoints/auth';
import { PrimaryButton } from '@/components/shared/Button';
import { Form, FormInput, useZodForm } from '@/components/shared/Form';
import {
  BackgroundGlow,
  Button,
  Card,
  IconAvatar,
  Input,
  Progress,
  StatusDot,
  useToast,
} from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import {
  loginEmailSchema,
  otpSchema,
  type LoginEmailInput,
  type OtpInput,
} from '@/lib/validations';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { addToast } = useToast();
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  // Email form
  const emailForm = useZodForm<LoginEmailInput>({
    schema: loginEmailSchema,
    defaultValues: { email: '' },
  });

  // OTP form
  const otpForm = useZodForm<OtpInput>({
    schema: otpSchema,
    defaultValues: { otp: '' },
  });

  const handleEmailSubmit = async (data: LoginEmailInput) => {
    setIsSubmitting(true);
    try {
      await auth.requestOtp({ email: data.email });
      setSubmittedEmail(data.email);
      setIsTransitioning(true);

      setTimeout(() => {
        setStep('otp');
        setIsTransitioning(false);
        addToast({
          type: 'success',
          title: 'Security Code Sent',
          message: `A 6-digit verification code has been dispatched to ${data.email}.`,
        });
      }, 600);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        error.message ||
        'Failed to send OTP. Please try again.';

      addToast({
        type: 'error',
        title: 'Authentication Error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (data: OtpInput) => {
    setIsSubmitting(true);
    try {
      const response = await auth.verifyOtp({ email: submittedEmail, otp: data.otp });

      // Extract data from API response structure
      const resultData = response.data || response;
      const { accessToken, user: userData } = resultData;
      console.log('Access Token', accessToken);
      console.log('User Data', userData);

      if (accessToken && userData) {
        // Decode token to extract role
        const decoded: any = jwtDecode(accessToken);
        const userRole = (decoded.role || 'student').toLowerCase() as any;

        login(accessToken, {
          ...userData,
          discord: userData.discordUsername || userData.discord,
          role: (userData.role || userRole) as any,
        });

        addToast({
          type: 'success',
          title: 'Identity Verified',
          message: 'Authentication successful. Synchronizing your dashboard data...',
        });

        setTimeout(() => {
          onLogin(submittedEmail);
        }, 1000);
      } else {
        throw new Error('Invalid response structure from server');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        error.message ||
        'Invalid OTP. Please check and try again.';

      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (type: 'admin' | 'student' | 'srm') => {
    const demoEmail =
      type === 'admin'
        ? 'admin@devcamp.io'
        : type === 'srm'
          ? 'srm@devcamp.io'
          : 'alex@student.com';

    // Set demo cookie for development/testing if needed
    if (import.meta.env.DEV) {
      login('demo-token', {
        _id: type === 'admin' ? 'admin-id' : type === 'srm' ? 'srm-id' : 'student-id',
        name: type === 'admin' ? 'Admin User' : type === 'srm' ? 'SRM Manager' : 'Alex Johnson',
        email: demoEmail,
        role: type,
        discord: type === 'student' ? 'alex#1234' : undefined,
      });
    }

    addToast({
      type: 'info',
      title: 'Demo Access Enabled',
      message: `Bypassing standard authentication for ${type} preview.`,
    });

    setTimeout(() => {
      onLogin(demoEmail);
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Update the form value with combined OTP
    const combinedOtp = newOtpDigits.join('');
    otpForm.setValue('otp', combinedOtp, {
      shouldValidate: combinedOtp.length === 6,
    });

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtpDigits(['', '', '', '', '', '']);
    otpForm.reset();
  };

  return (
    <div className="bg-background-dark font-display relative flex min-h-screen w-full flex-col overflow-x-hidden text-white antialiased transition-colors duration-200">
      <header className="absolute top-0 z-10 flex w-full items-center justify-between px-4 py-3 whitespace-nowrap md:px-6 md:py-4 lg:px-10 lg:py-6">
        <div className="flex items-center gap-2 md:gap-3">
          <IconAvatar variant="primary" size="sm" bordered={false} className="rounded-lg">
            <Icon name="school" className="text-2xl" />
          </IconAvatar>
          <h2 className="text-lg leading-tight font-bold tracking-tight text-white">
            Bootcamp Portal
          </h2>
        </div>
        <div className="hidden sm:block">
          <Button
            variant="link"
            className="hover:text-primary h-auto p-0 text-sm font-medium text-gray-400"
          >
            Help & Support
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-4 pt-20 pb-16">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <BackgroundGlow position="top-left" size="md" blur="xl" />
          <BackgroundGlow
            variant="primary-strong"
            position="center-right"
            size="sm"
            blur="lg"
            className="h-[60%] w-[40%]"
          />
        </div>
        <Card className="bg-surface-dark relative z-10 w-full max-w-[600px] overflow-hidden rounded-3xl border-gray-800 shadow-xl transition-all duration-300">
          <Progress
            value={step === 'email' ? 50 : 100}
            className="h-1 rounded-none bg-gray-800"
            indicatorClassName="transition-all duration-500 ease-out"
          />
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            {step === 'email' ? (
              <div
                className={`transform transition-all duration-300 ${isTransitioning ? '-translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}
              >
                <div className="mb-8 text-center">
                  <IconAvatar
                    variant="primary"
                    size="lg"
                    bordered={false}
                    className="bg-primary/20 mx-auto mb-4 rounded-full"
                  >
                    <Icon name="lock_person" className="text-4xl" />
                  </IconAvatar>
                  <h1 className="mb-2 text-2xl leading-tight font-bold text-white">Welcome Back</h1>
                  <p className="text-sm font-medium text-gray-400">
                    Enter your email to access your dashboard.
                  </p>
                </div>
                <Form form={emailForm} onSubmit={handleEmailSubmit} className="space-y-6">
                  <FormInput
                    label="Email Address"
                    placeholder="student@bootcamp.com"
                    autoComplete="email"
                    variant="filled"
                    icon="mail"
                    error={emailForm.formState.errors.email?.message}
                    required
                    {...emailForm.register('email')}
                  />
                  <PrimaryButton
                    loading={isSubmitting}
                    className="group h-14 w-full rounded-2xl text-sm font-bold tracking-wide text-[#111814] uppercase"
                    type="submit"
                  >
                    <span className="mr-2">Get Login Code</span>
                    <Icon
                      name="arrow_forward"
                      className="text-lg transition-transform group-hover:translate-x-1"
                    />
                  </PrimaryButton>
                  <div className="mt-6 text-center">
                    <Link
                      to="/register"
                      className="text-primary hover:text-primary-hover text-sm font-bold tracking-widest uppercase transition-colors"
                    >
                      New student? Register for access
                    </Link>
                  </div>
                </Form>
                {/* Development-Only Quick Login */}
                {import.meta.env.DEV && (
                  <>
                    <div className="relative my-8">
                      <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-surface-dark px-2 text-sm font-bold tracking-widest text-gray-500 uppercase">
                          Demo Access
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleQuickLogin('admin')}
                        className="bg-surface-dark border-border-dark hover:border-primary/50 flex h-auto items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-sm font-bold text-white hover:bg-white/5"
                      >
                        <Icon name="admin_panel_settings" className="text-primary text-lg" />
                        Admin
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleQuickLogin('srm')}
                        className="bg-surface-dark border-border-dark hover:border-primary/50 flex h-auto items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-sm font-bold text-white hover:bg-white/5"
                      >
                        <Icon name="support_agent" className="text-primary text-lg" />
                        SRM
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleQuickLogin('student')}
                        className="bg-surface-dark border-border-dark hover:border-primary/50 flex h-auto items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-sm font-bold text-white hover:bg-white/5"
                      >
                        <Icon name="person" className="text-primary text-lg" />
                        Student
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                className={`transform transition-all duration-300 ${isTransitioning ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}
              >
                <div className="mb-8 text-center">
                  <IconAvatar
                    variant="primary"
                    size="lg"
                    bordered={false}
                    className="bg-primary/20 mx-auto mb-4 rounded-full"
                  >
                    <Icon name="mark_email_unread" className="text-[32px]" />
                  </IconAvatar>
                  <h1 className="mb-2 text-2xl leading-tight font-bold text-white">
                    Check your inbox
                  </h1>
                  <p className="text-sm text-gray-400">
                    We sent a 6-digit code to{' '}
                    <span className="font-semibold text-white">
                      {submittedEmail || 'student@bootcamp.com'}
                    </span>
                  </p>
                </div>
                <Form form={otpForm} onSubmit={handleVerify} className="space-y-8">
                  {/* Hidden input for form validation */}
                  <input type="hidden" {...otpForm.register('otp')} />

                  <div className="space-y-2">
                    <div className="flex justify-center gap-1.5 sm:gap-3">
                      {otpDigits.map((digit, i) => (
                        <Input
                          key={i}
                          id={`otp-${i}`}
                          name={`otp-digit-${i}`}
                          autoComplete="one-time-code"
                          variant="otp"
                          maxLength={1}
                          placeholder="•"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-11 w-9 text-lg sm:h-14 sm:w-12 sm:text-xl"
                        />
                      ))}
                    </div>
                    {otpForm.formState.errors.otp && (
                      <p className="mt-2 text-center text-sm text-red-500">
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  <PrimaryButton
                    loading={isSubmitting}
                    className="h-14 w-full rounded-2xl text-sm font-bold tracking-wide text-[#111814] uppercase"
                    type="submit"
                  >
                    Verify & Login
                  </PrimaryButton>
                  <div className="flex flex-col gap-3 text-center">
                    <p className="text-xs text-gray-400 sm:text-sm">
                      Didn't receive the code?
                      <Button
                        type="button"
                        variant="link"
                        className="text-primary hover:text-primary-hover ml-1 h-auto p-0 font-bold"
                      >
                        Resend in 30s
                      </Button>
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm text-gray-500 underline hover:text-gray-400"
                      onClick={handleBackToEmail}
                    >
                      Change email address
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </div>
        </Card>
      </main>
      <div className="pointer-events-none fixed bottom-4 left-4 z-20 flex items-center gap-2 text-sm text-gray-600">
        <StatusDot variant="primary" pulse />
        System Operational
      </div>
    </div>
  );
};

export default LoginPage;
