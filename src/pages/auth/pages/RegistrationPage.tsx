/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/constants';
import { BackgroundGlow, Card, IconAvatar, Progress, StatusDot, useToast } from '@/components/ui';





import { Form, FormInput, useZodForm } from '@/components/shared/Form';
import { PrimaryButton } from '@/components/shared/Button';
import * as auth from '@/api/endpoints/auth';
import {
  studentRegistrationSchema,
  type StudentRegistrationInput,
} from '@/lib/validations';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const form = useZodForm<StudentRegistrationInput>({
    schema: studentRegistrationSchema,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      discord: '',
    },
  });

  const handleSubmit = async (data: StudentRegistrationInput) => {
    setIsSubmitting(true);
    try {
      await auth.registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        discordUsername: data.discord,
      });
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      addToast({
        type: 'success',
        title: 'Application Received',
        message: 'Your registration has been submitted successfully.',
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred.';
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display antialiased text-white items-center justify-center p-4">
        <Card className="relative z-10 w-full max-w-[480px] rounded-[2.5rem] bg-surface-dark shadow-2xl border-gray-800 p-6 md:p-12 flex flex-col items-center text-center animate-fade-in-up">
          <IconAvatar
            size="2xl"
            className="mb-8 shadow-[0_0_30px_rgba(19,236,106,0.15)]"
          >
            <Icon name="check_circle" className="text-6xl" />
          </IconAvatar>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
            Registration Sent
          </h1>
          <p className="text-text-secondary text-base font-medium mb-10 leading-relaxed">
            Your application for{' '}
            <span className="text-white font-bold">Cohort 12</span> has been
            received. Our admins will review your details and send a login code
            to <span className="text-primary font-bold">{submittedEmail}</span>{' '}
            soon.
          </p>
          <PrimaryButton
            onClick={() => navigate('/')}
            className="w-full h-16 rounded-2xl bg-primary text-background-dark text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary-hover shadow-xl shadow-primary/20 active:scale-95"
          >
            Go to Login
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark font-display antialiased text-white transition-colors duration-200">
      <header className="flex items-center justify-between whitespace-nowrap px-4 py-3 md:px-6 md:py-4 lg:px-10 lg:py-6 w-full absolute top-0 z-10">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <IconAvatar
            variant="primary"
            size="sm"
            bordered={false}
            className="rounded-lg group-hover:rotate-12 transition-transform"
          >
            <Icon name="school" className="text-2xl" />
          </IconAvatar>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">
            Bootcamp Portal
          </h2>
        </Link>
        <div className="hidden sm:block">
          <Link
            to="/"
            className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
          >
            Already registered? Log in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 pt-24 pb-24 lg:py-0 w-full relative">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <BackgroundGlow position="top-left" size="md" blur="xl" />
          <BackgroundGlow
            variant="primary-strong"
            position="center-right"
            size="sm"
            blur="lg"
            className="w-[40%] h-[60%]"
          />
        </div>

        <Card className="relative z-10 w-full max-w-[900px] rounded-3xl bg-surface-dark shadow-[0_35px_100px_-15px_rgba(0,0,0,0.6)] border-gray-800 overflow-hidden animate-fade-in-up mb-8">
          <Progress
            value={isSubmitting ? 100 : 33}
            className="h-1.5 rounded-none border-0 bg-gray-800"
            indicatorClassName={`rounded-none transition-all duration-700 ease-out ${isSubmitting ? 'animate-pulse' : ''}`}
          />

          <div className="px-5 py-8 sm:px-14 sm:py-16">
            <div className="mb-8 sm:mb-12 text-center">
              <IconAvatar
                variant="primary"
                size="lg"
                className="mx-auto mb-4 sm:mb-6 rounded-[1.5rem] bg-primary/20"
              >
                <Icon name="assignment_ind" className="text-[32px]" />
              </IconAvatar>
              <h1 className="text-3xl font-black leading-tight text-white mb-3 uppercase tracking-tight">
                Join DevCamp
              </h1>
              <p className="text-sm text-gray-500 font-medium tracking-wide">
                Enter your details to register for the next cohort.
              </p>
            </div>

            <Form form={form} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  placeholder="e.g. Alex Johnson"
                  autoComplete="name"
                  variant="filled"
                  icon="person"
                  error={form.formState.errors.name?.message}
                  required
                  {...form.register('name')}
                />

                <FormInput
                  label="Email Address"
                  placeholder="alex@example.com"
                  autoComplete="email"
                  variant="filled"
                  icon="mail"
                  error={form.formState.errors.email?.message}
                  required
                  {...form.register('email')}
                />

                <FormInput
                  label="Phone Number"
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                  type="tel"
                  variant="filled"
                  icon="call"
                  error={form.formState.errors.phone?.message}
                  required
                  {...form.register('phone')}
                />

                <FormInput
                  label="Discord Tag"
                  placeholder="user#1234"
                  autoComplete="off"
                  variant="filled"
                  icon="forum"
                  error={form.formState.errors.discord?.message}
                  required
                  {...form.register('discord')}
                />
              </div>

              <div className="pt-4">
                <PrimaryButton
                  loading={isSubmitting}
                  className="group w-full h-auto py-5 rounded-2xl text-sm font-bold uppercase tracking-[0.2em] text-background-dark shadow-[0_10px_40px_rgba(19,236,106,0.2)]"
                  type="submit"
                >
                  <span>Submit Application</span>
                  <Icon
                    name="rocket_launch"
                    className="ml-3 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </PrimaryButton>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/"
                  className="text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                >
                  Return to login portal
                </Link>
              </div>
            </Form>
          </div>
        </Card>
      </main>

      <div className="fixed bottom-6 right-6 z-20 flex items-center gap-3 text-sm font-bold text-gray-600 uppercase tracking-widest pointer-events-none">
        <StatusDot variant="primary" pulse />
        Applications Open
      </div>
    </div>
  );
};

export default RegistrationPage;
