import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { addToast } = useToast();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    // Simulate API delay
    setTimeout(() => {
      setStep('otp');
      setIsTransitioning(false);
      addToast({
        type: 'success',
        title: 'Security Code Sent',
        message: `A 6-digit verification code has been dispatched to ${email}.`
      });
    }, 600);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length < 6) {
      addToast({
        type: 'warning',
        title: 'Incomplete Code',
        message: 'Please enter the full 6-digit security code to proceed.'
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Identity Verified',
      message: 'Authentication successful. Synchronizing your dashboard data...'
    });
    
    setTimeout(() => {
      onLogin(email);
    }, 1000);
  };

  const handleQuickLogin = (type: 'admin' | 'student') => {
    const demoEmail = type === 'admin' ? 'admin@devcamp.io' : 'alex@student.com';
    
    addToast({
      type: 'info',
      title: 'Demo Access Enabled',
      message: `Bypassing standard authentication for ${type} preview.`
    });
    
    setTimeout(() => {
      onLogin(demoEmail);
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display antialiased text-white transition-colors duration-200">
      <header className="flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-10 lg:py-6 w-full absolute top-0 z-10">
        <div className="flex items-center gap-3">
          <IconAvatar variant="primary" size="sm" bordered={false} className="rounded-lg">
            <Icon name="school" className="text-2xl" />
          </IconAvatar>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Bootcamp Portal</h2>
        </div>
        <div className="hidden sm:block">
          <Button variant="link" className="text-sm font-medium text-gray-400 hover:text-primary p-0 h-auto">
            Help & Support
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <BackgroundGlow position="top-left" size="md" blur="xl" />
          <BackgroundGlow variant="primary-strong" position="center-right" size="sm" blur="lg" className="w-[40%] h-[60%]" />
        </div>
        <Card className="relative z-10 w-full max-w-[600px] rounded-3xl bg-surface-dark shadow-xl border-gray-800 overflow-hidden transition-all duration-300">
          <Progress 
            value={step === 'email' ? 50 : 100} 
            className="h-1 rounded-none bg-gray-800" 
            indicatorClassName="transition-all duration-500 ease-out"
          />
          <div className="px-8 py-10 sm:px-10 sm:py-12">
            {step === 'email' ? (
              <div className={`transition-all duration-300 transform ${isTransitioning ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}>
                <div className="mb-8 text-center">
                  <IconAvatar variant="primary" size="lg" bordered={false} className="mx-auto mb-4 rounded-full bg-primary/20">
                    <Icon name="lock_person" className="text-4xl" />
                  </IconAvatar>
                  <h1 className="text-2xl font-bold leading-tight text-white mb-2">Welcome Back</h1>
                  <p className="text-sm font-medium text-gray-400">Enter your email to access your dashboard.</p>
                </div>
                <form className="space-y-6" onSubmit={handleEmailSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm text-gray-300">Email Address</Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <Icon name="mail" className="text-xl" />
                      </div>
                      <Input 
                        id="login-email"
                        name="email"
                        autoComplete="email"
                        variant="filled"
                        hasIcon="left"
                        placeholder="student@bootcamp.com" 
                        required 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-primary h-14 text-sm font-bold text-[#111814] shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 uppercase tracking-wide" type="submit">
                    <span className="mr-2">Get Login Code</span>
                    <Icon name="arrow_forward" className="text-lg transition-transform group-hover:translate-x-1" />
                  </Button>
                  <div className="text-center mt-6">
                    <Link to="/register" className="text-sm font-bold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">New student? Register for access</Link>
                  </div>
                </form>
                {/* Development-Only Quick Login */}
                {import.meta.env.DEV && (
                  <>
                    <div className="relative my-8">
                      <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-surface-dark px-2 text-sm text-gray-500 uppercase tracking-widest font-bold">Demo Access</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => handleQuickLogin('admin')}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 h-auto rounded-lg bg-surface-dark border border-border-dark text-sm font-bold text-white hover:bg-white/5 hover:border-primary/50"
                      >
                        <Icon name="admin_panel_settings" className="text-primary text-lg" />
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
              <div className={`transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
                <div className="mb-8 text-center">
                  <IconAvatar variant="primary" size="lg" bordered={false} className="mx-auto mb-4 rounded-full bg-primary/20">
                    <Icon name="mark_email_unread" className="text-[32px]" />
                  </IconAvatar>
                  <h1 className="text-2xl font-bold leading-tight text-white mb-2">Check your inbox</h1>
                  <p className="text-sm text-gray-400">We sent a 6-digit code to <span className="text-white font-semibold">{email || 'student@bootcamp.com'}</span></p>
                </div>
                <form className="space-y-8" onSubmit={handleVerify}>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, i) => (
                      <Input 
                        key={i}
                        id={`otp-${i}`}
                        name={`otp-${i}`}
                        autoComplete="one-time-code"
                        variant="otp"
                        maxLength={1} 
                        placeholder="•" 
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                      />
                    ))}
                  </div>
                  <Button className="flex w-full items-center justify-center overflow-hidden rounded-2xl bg-primary h-14 text-sm font-bold text-[#111814] shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 uppercase tracking-wide" type="submit">
                    Verify & Login
                  </Button>
                  <div className="text-center flex flex-col gap-3">
                    <p className="text-xs sm:text-sm text-gray-400">
                      Didn't receive the code? 
                      <Button type="button" variant="link" className="font-bold text-primary hover:text-primary-hover ml-1 p-0 h-auto">Resend in 30s</Button>
                    </p>
                    <Button type="button" variant="link" className="text-sm text-gray-500 hover:text-gray-400 underline p-0 h-auto" onClick={() => setStep('email')}>
                      Change email address
                    </Button>
                  </div>
                </form>
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