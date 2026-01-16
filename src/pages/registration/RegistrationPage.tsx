import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/constants';
import { useToast } from '@/context/ToastContext';

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
        <div className="relative z-10 w-full max-w-[480px] rounded-[2.5rem] bg-surface-dark shadow-2xl border border-gray-800 p-12 flex flex-col items-center text-center animate-fade-in-up">
          <div className="size-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-[0_0_30px_rgba(19,236,106,0.15)]">
            <Icon name="check_circle" className="text-6xl" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Registration Sent</h1>
          <p className="text-text-secondary text-base font-medium mb-10 leading-relaxed">
            Your application for <span className="text-white font-bold">Cohort 12</span> has been received. Our admins will review your details and send a login code to <span className="text-primary font-bold">{formData.email}</span> soon.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full h-16 rounded-2xl bg-primary text-background-dark text-sm font-bold uppercase tracking-[0.2em] hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display antialiased text-white transition-colors duration-200">
      <header className="flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-10 lg:py-6 w-full absolute top-0 z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:rotate-12 transition-transform">
            <Icon name="school" className="text-2xl" />
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Bootcamp Portal</h2>
        </Link>
        <div className="hidden sm:block">
          <Link to="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">Already registered? Log in</Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 py-20 lg:py-0">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-primary/10 blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[900px] rounded-3xl bg-surface-dark shadow-[0_35px_100px_-15px_rgba(0,0,0,0.6)] border border-gray-800 overflow-hidden animate-fade-in-up">
          <div className="h-1.5 w-full bg-gray-800">
            <div className={`h-full bg-primary transition-all duration-700 ease-out ${isSubmitting ? 'w-full animate-pulse' : 'w-1/3'}`}></div>
          </div>
          
          <div className="px-10 py-12 sm:px-14 sm:py-16">
            <div className="mb-12 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/20 text-primary border border-primary/20">
                <Icon name="assignment_ind" className="text-[32px]" />
              </div>
              <h1 className="text-3xl font-black leading-tight text-white mb-3 uppercase tracking-tight">Join DevCamp</h1>
              <p className="text-sm text-gray-500 font-medium tracking-wide">Enter your details to register for the next cohort.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-primary transition-colors ml-1">Full Name</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="person" className="text-xl" />
                    </div>
                    <input 
                      name="name"
                      required 
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border border-gray-800 bg-[#0c140f] pl-14 pr-4 h-14 text-white placeholder-gray-700 focus:border-primary focus:ring-1 focus:ring-primary/40 sm:text-sm font-medium transition-all outline-none" 
                      placeholder="e.g. Alex Johnson" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-primary transition-colors ml-1">Email Address</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="mail" className="text-xl" />
                    </div>
                    <input 
                      name="email"
                      required 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border border-gray-800 bg-[#0c140f] pl-14 pr-4 h-14 text-white placeholder-gray-700 focus:border-primary focus:ring-1 focus:ring-primary/40 sm:text-sm font-medium transition-all outline-none" 
                      placeholder="alex@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-primary transition-colors ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="call" className="text-xl" />
                    </div>
                    <input 
                      name="phone"
                      required 
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border border-gray-800 bg-[#0c140f] pl-14 pr-4 h-14 text-white placeholder-gray-700 focus:border-primary focus:ring-1 focus:ring-primary/40 sm:text-sm font-medium transition-all outline-none" 
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-primary transition-colors ml-1">Discord Tag</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within:text-primary transition-colors">
                      <Icon name="forum" className="text-xl" />
                    </div>
                    <input 
                      name="discord"
                      required 
                      type="text"
                      value={formData.discord}
                      onChange={handleChange}
                      className="block w-full rounded-2xl border border-gray-800 bg-[#0c140f] pl-14 pr-4 h-14 text-white placeholder-gray-700 focus:border-primary focus:ring-1 focus:ring-primary/40 sm:text-sm font-medium transition-all outline-none" 
                      placeholder="user#1234" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-primary px-4 py-5 text-sm font-bold text-background-dark shadow-[0_10px_40px_rgba(19,236,106,0.2)] hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 uppercase tracking-[0.2em] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed" 
                  type="submit"
                >
                  {isSubmitting ? (
                    <div className="size-6 border-4 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Icon name="rocket_launch" className="ml-3 text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center mt-8">
                <Link to="/" className="text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                  Return to login portal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-20 flex items-center gap-3 text-sm font-bold text-gray-600 uppercase tracking-widest pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        Cohort 12 Applications Open
      </div>
    </div>
  );
};

export default RegistrationPage;