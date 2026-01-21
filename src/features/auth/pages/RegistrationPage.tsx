import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/constants';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { IconAvatar } from '@/components/ui/icon-avatar';
import { StatusDot } from '@/components/ui/status-dot';
import { BackgroundGlow } from '@/components/ui/background-glow';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    discord: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation feedback via toast
    if (!formData.discord.includes('#') && formData.discord.length > 0) {
      addToast({
        type: 'warning',
        title: 'Format Hint',
        message: 'Discord tags usually include a # followed by numbers (e.g. user#1234).'
      });
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      addToast({
        type: 'success',
        title: 'Application Received',
        message: 'Your enrollment request has been queued for review by our admissions team.'
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display antialiased text-white items-center justify-center p-4">
        <Card className="relative z-10 w-full max-w-[480px] rounded-[2.5rem] bg-surface-dark shadow-2xl border-gray-800 p-12 flex flex-col items-center text-center animate-fade-in-up">
          <IconAvatar size="2xl" className="mb-8 shadow-[0_0_30px_rgba(19,236,106,0.15)]">
            <Icon name="check_circle" className="text-6xl" />
          </IconAvatar>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Registration Sent</h1>
          <p className="text-text-secondary text-base font-medium mb-10 leading-relaxed">
            Your application for <span className="text-white font-bold">Cohort 12</span> has been received. Our admins will review your details and send a login code to <span className="text-primary font-bold">{formData.email}</span> soon.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full h-16 rounded-2xl bg-primary text-background-dark text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary-hover shadow-xl shadow-primary/20 active:scale-95"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display antialiased text-white transition-colors duration-200">
      <header className="flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-10 lg:py-6 w-full absolute top-0 z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <IconAvatar variant="primary" size="sm" bordered={false} className="rounded-lg group-hover:rotate-12 transition-transform">
            <Icon name="school" className="text-2xl" />
          </IconAvatar>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Bootcamp Portal</h2>
        </Link>
        <div className="hidden sm:block">
          <Link to="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">Already registered? Log in</Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 py-20 lg:py-0">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <BackgroundGlow position="top-left" size="md" blur="xl" />
          <BackgroundGlow variant="primary-strong" position="center-right" size="sm" blur="lg" className="w-[40%] h-[60%]" />
        </div>

        <Card className="relative z-10 w-full max-w-[900px] rounded-3xl bg-surface-dark shadow-[0_35px_100px_-15px_rgba(0,0,0,0.6)] border-gray-800 overflow-hidden animate-fade-in-up">
          <Progress 
            value={isSubmitting ? 100 : 33} 
            className="h-1.5 rounded-none border-0 bg-gray-800"
            indicatorClassName={`rounded-none transition-all duration-700 ease-out ${isSubmitting ? 'animate-pulse' : ''}`}
          />
          
          <div className="px-10 py-12 sm:px-14 sm:py-16">
            <div className="mb-12 text-center">
              <IconAvatar variant="primary" size="lg" className="mx-auto mb-6 rounded-[1.5rem] bg-primary/20">
                <Icon name="assignment_ind" className="text-[32px]" />
              </IconAvatar>
              <h1 className="text-3xl font-black leading-tight text-white mb-3 uppercase tracking-tight">Join DevCamp</h1>
              <p className="text-sm text-gray-500 font-medium tracking-wide">Enter your details to register for the next cohort.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label htmlFor="register-name" className="ml-1 group-focus-within:text-primary transition-colors">Full Name</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="person" className="text-xl" />
                    </div>
                    <Input 
                      id="register-name"
                      name="name"
                      autoComplete="name"
                      required 
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      variant="filled"
                      hasIcon="left"
                      placeholder="e.g. Alex Johnson" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="register-email" className="ml-1 group-focus-within:text-primary transition-colors">Email Address</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="mail" className="text-xl" />
                    </div>
                    <Input 
                      id="register-email"
                      name="email"
                      autoComplete="email"
                      required 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="filled"
                      hasIcon="left"
                      placeholder="alex@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="register-phone" className="ml-1 group-focus-within:text-primary transition-colors">Phone Number</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="call" className="text-xl" />
                    </div>
                    <Input 
                      id="register-phone"
                      name="phone"
                      autoComplete="tel"
                      required 
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="filled"
                      hasIcon="left"
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="register-discord" className="ml-1 group-focus-within:text-primary transition-colors">Discord Tag</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="forum" className="text-xl" />
                    </div>
                    <Input 
                      id="register-discord"
                      name="discord"
                      autoComplete="off"
                      required 
                      type="text"
                      value={formData.discord}
                      onChange={handleChange}
                      variant="filled"
                      hasIcon="left"
                      placeholder="user#1234" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-primary px-4 py-5 h-auto text-sm font-bold text-background-dark shadow-[0_10px_40px_rgba(19,236,106,0.2)] hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 uppercase tracking-[0.2em] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed" 
                  type="submit"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" fullHeight={false} />
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Icon name="rocket_launch" className="ml-3 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center mt-8">
                <Link to="/" className="text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                  Return to login portal
                </Link>
              </div>
            </form>
          </div>
        </Card>
      </main>

      <div className="fixed bottom-6 right-6 z-20 flex items-center gap-3 text-sm font-bold text-gray-600 uppercase tracking-widest pointer-events-none">
        <StatusDot variant="primary" pulse />
        Cohort 12 Applications Open
      </div>
    </div>
  );
};

export default RegistrationPage;