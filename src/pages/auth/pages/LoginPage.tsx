/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/constants';
import { BackgroundGlow, Button, Card, IconAvatar, Input, Progress, StatusDot, useToast } from '@/components/ui'
import { Form, FormInput, useZodForm } from '@/components/shared/Form';
import { PrimaryButton } from '@/components/shared/Button';
import * as auth from '@/api/endpoints/auth';
import { useAuth } from '@/hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
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
      console.log("Access Token", accessToken)
      console.log("User Data", userData)

      if (accessToken && userData) {
        // Decode token to extract role
        const decoded: any = jwtDecode(accessToken);
        const userRole = (decoded.role || 'student').toLowerCase() as any;
        console.log("User Role", userRole)
        console.log("User Data", userData)

        login(accessToken, {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          discord: userData.discordUsername,
          role: userRole,
        });

        addToast({
          type: 'success',
          title: 'Identity Verified',
          message:
            'Authentication successful. Synchronizing your dashboard data...',
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

  const handleQuickLogin = (type: 'admin' | 'student') => {
    const demoEmail =
      type === 'admin' ? 'admin@devcamp.io' : 'alex@student.com';

    // Set demo cookie for development/testing if needed
    if (import.meta.env.DEV) {
      login('demo-token', {
        id: type === 'admin' ? 'admin-id' : 'student-id',
        name: type === 'admin' ? 'Admin User' : 'Alex Johnson',
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

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
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
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display antialiased text-white transition-colors duration-200">
      <header className="flex items-center justify-between whitespace-nowrap px-4 py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full absolute top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <IconAvatar
            variant="primary"
            size="sm"
            bordered={false}
            className="rounded-lg"
          >
            <Icon name="school" className="text-2xl" />
          </IconAvatar>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">
            Bootcamp Portal
          </h2>
        </div>
        <div className="hidden sm:block">
          <Button
            variant="link"
            className="text-sm font-medium text-gray-400 hover:text-primary p-0 h-auto"
          >
            Help & Support
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <BackgroundGlow position="top-left" size="md" blur="xl" />
          <BackgroundGlow
            variant="primary-strong"
            position="center-right"
            size="sm"
            blur="lg"
            className="w-[40%] h-[60%]"
          />
        </div>
        <Card className="relative z-10 w-full max-w-[600px] rounded-3xl bg-surface-dark shadow-xl border-gray-800 overflow-hidden transition-all duration-300">
          <Progress
            value={step === 'email' ? 50 : 100}
            className="h-1 rounded-none bg-gray-800"
            indicatorClassName="transition-all duration-500 ease-out"
          />
          <div className="px-5 py-8 sm:px-10 sm:py-12">
            {step === 'email' ? (
              <div
                className={`transition-all duration-300 transform ${isTransitioning ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}
              >
                <div className="mb-8 text-center">
                  <IconAvatar
                    variant="primary"
                    size="lg"
                    bordered={false}
                    className="mx-auto mb-4 rounded-full bg-primary/20"
                  >
                    <Icon name="lock_person" className="text-4xl" />
                  </IconAvatar>
                  <h1 className="text-2xl font-bold leading-tight text-white mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-sm font-medium text-gray-400">
                    Enter your email to access your dashboard.
                  </p>
                </div>
                <Form
                  form={emailForm}
                  onSubmit={handleEmailSubmit}
                  className="space-y-6"
                >
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
                    className="group w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wide text-[#111814]"
                    type="submit"
                  >
                    <span className="mr-2">Get Login Code</span>
                    <Icon
                      name="arrow_forward"
                      className="text-lg transition-transform group-hover:translate-x-1"
                    />
                  </PrimaryButton>
                  <div className="text-center mt-6">
                    <Link
                      to="/register"
                      className="text-sm font-bold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
                    >
                      New student? Register for access
                    </Link>
                  </div>
                </Form>
                {/* Development-Only Quick Login */}
                {import.meta.env.DEV && (
                  <>
                    <div className="relative my-8">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center"
                      >
                        <div className="w-full border-t border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-surface-dark px-2 text-sm text-gray-500 uppercase tracking-widest font-bold">
                          Demo Access
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleQuickLogin('admin')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 h-auto rounded-lg bg-surface-dark border border-border-dark text-sm font-bold text-white hover:bg-white/5 hover:border-primary/50"
                      >
                        <Icon
                          name="admin_panel_settings"
                          className="text-primary text-lg"
                        />
                        Admin Access
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleQuickLogin('student')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 h-auto rounded-lg bg-surface-dark border border-border-dark text-sm font-bold text-white hover:bg-white/5 hover:border-primary/50"
                      >
                        <Icon name="person" className="text-primary text-lg" />
                        Student Access
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                className={`transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
              >
                <div className="mb-8 text-center">
                  <IconAvatar
                    variant="primary"
                    size="lg"
                    bordered={false}
                    className="mx-auto mb-4 rounded-full bg-primary/20"
                  >
                    <Icon name="mark_email_unread" className="text-[32px]" />
                  </IconAvatar>
                  <h1 className="text-2xl font-bold leading-tight text-white mb-2">
                    Check your inbox
                  </h1>
                  <p className="text-sm text-gray-400">
                    We sent a 6-digit code to{' '}
                    <span className="text-white font-semibold">
                      {submittedEmail || 'student@bootcamp.com'}
                    </span>
                  </p>
                </div>
                <Form
                  form={otpForm}
                  onSubmit={handleVerify}
                  className="space-y-8"
                >
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
                          className="w-9 h-11 text-lg sm:w-12 sm:h-14 sm:text-xl"
                        />
                      ))}
                    </div>
                    {otpForm.formState.errors.otp && (
                      <p className="text-center text-sm text-red-500 mt-2">
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  <PrimaryButton
                    loading={isSubmitting}
                    className="w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wide text-[#111814]"
                    type="submit"
                  >
                    Verify & Login
                  </PrimaryButton>
                  <div className="text-center flex flex-col gap-3">
                    <p className="text-xs sm:text-sm text-gray-400">
                      Didn't receive the code?
                      <Button
                        type="button"
                        variant="link"
                        className="font-bold text-primary hover:text-primary-hover ml-1 p-0 h-auto"
                      >
                        Resend in 30s
                      </Button>
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-gray-500 hover:text-gray-400 underline p-0 h-auto"
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
      <div className="fixed bottom-4 left-4 z-20 flex items-center gap-2 text-sm text-gray-600 pointer-events-none">
        <StatusDot variant="primary" pulse />
        System Operational
      </div>
    </div>
  );
};

export default LoginPage;
