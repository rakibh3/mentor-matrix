/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Icon } from '@/constants';
import { Link, useNavigate } from 'react-router-dom';

import { createStudent } from '@/api/endpoints/students';
import { PrimaryButton } from '@/components/shared/Button';
import { Form, FormInput, useZodForm } from '@/components/shared/Form';
import { BackgroundGlow, Card, IconAvatar, Progress, StatusDot, useToast } from '@/components/ui';
import { studentRegistrationSchema, type StudentRegistrationInput } from '@/lib/validations';

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
      await createStudent({
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
      <div className="bg-background-dark font-display relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 text-white antialiased">
        <Card className="bg-surface-dark animate-fade-in-up relative z-10 flex w-full max-w-[480px] flex-col items-center rounded-[2.5rem] border-gray-800 p-6 text-center shadow-2xl md:p-12">
          <IconAvatar size="2xl" className="mb-8 shadow-[0_0_30px_rgba(19,236,106,0.15)]">
            <Icon name="check_circle" className="text-6xl" />
          </IconAvatar>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-white uppercase">
            Registration Sent
          </h1>
          <p className="text-text-secondary mb-10 text-base leading-relaxed font-medium">
            Your application for <span className="font-bold text-white">Cohort 12</span> has been
            received. Our admins will review your details and send a login code to{' '}
            <span className="text-primary font-bold">{submittedEmail}</span> soon.
          </p>
          <PrimaryButton
            onClick={() => navigate('/')}
            className="bg-primary text-background-dark hover:bg-primary-hover shadow-primary/20 h-16 w-full rounded-2xl text-sm font-bold tracking-[0.2em] uppercase shadow-xl active:scale-95"
          >
            Go to Login
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display relative flex min-h-screen w-full flex-col overflow-x-hidden text-white antialiased transition-colors duration-200">
      <header className="absolute top-0 z-10 flex w-full items-center justify-between px-4 py-3 whitespace-nowrap md:px-6 md:py-4 lg:px-10 lg:py-6">
        <Link to="/" className="group flex items-center gap-2 md:gap-3">
          <IconAvatar
            variant="primary"
            size="sm"
            bordered={false}
            className="rounded-lg transition-transform group-hover:rotate-12"
          >
            <Icon name="school" className="text-2xl" />
          </IconAvatar>
          <h2 className="text-lg leading-tight font-bold tracking-tight text-white">
            Bootcamp Portal
          </h2>
        </Link>
        <div className="hidden sm:block">
          <Link
            to="/"
            className="hover:text-primary text-sm font-bold tracking-widest text-gray-500 uppercase transition-colors"
          >
            Already registered? Log in
          </Link>
        </div>
      </header>

      <main className="relative flex w-full flex-1 flex-col items-center justify-center p-4 pt-24 pb-24 lg:py-0">
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

        <Card className="bg-surface-dark animate-fade-in-up relative z-10 mb-8 w-full max-w-[900px] overflow-hidden rounded-3xl border-gray-800 shadow-[0_35px_100px_-15px_rgba(0,0,0,0.6)]">
          <Progress
            value={isSubmitting ? 100 : 33}
            className="h-1.5 rounded-none border-0 bg-gray-800"
            indicatorClassName={`rounded-none transition-all duration-700 ease-out ${isSubmitting ? 'animate-pulse' : ''}`}
          />

          <div className="px-5 py-8 sm:px-14 sm:py-16">
            <div className="mb-8 text-center sm:mb-12">
              <IconAvatar
                variant="primary"
                size="lg"
                className="bg-primary/20 mx-auto mb-4 rounded-[1.5rem] sm:mb-6"
              >
                <Icon name="assignment_ind" className="text-[32px]" />
              </IconAvatar>
              <h1 className="mb-3 text-3xl leading-tight font-black tracking-tight text-white uppercase">
                Join DevCamp
              </h1>
              <p className="text-sm font-medium tracking-wide text-gray-500">
                Enter your details to register for the next cohort.
              </p>
            </div>

            <Form form={form} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  className="group text-background-dark h-auto w-full rounded-2xl py-5 text-sm font-bold tracking-[0.2em] uppercase shadow-[0_10px_40px_rgba(19,236,106,0.2)]"
                  type="submit"
                >
                  <span>Submit Application</span>
                  <Icon
                    name="rocket_launch"
                    className="ml-3 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </PrimaryButton>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="text-sm font-bold tracking-widest text-gray-600 uppercase transition-colors hover:text-white"
                >
                  Return to login portal
                </Link>
              </div>
            </Form>
          </div>
        </Card>
      </main>

      <div className="pointer-events-none fixed right-6 bottom-6 z-20 flex items-center gap-3 text-sm font-bold tracking-widest text-gray-600 uppercase">
        <StatusDot variant="primary" pulse />
        Applications Open
      </div>
    </div>
  );
};

export default RegistrationPage;
