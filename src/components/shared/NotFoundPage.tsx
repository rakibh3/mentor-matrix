import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/constants';
import { BackgroundGlow, Button, Card, IconAvatar } from '@/components/ui';




const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-dark font-display antialiased text-white items-center justify-center p-4">
      {/* Background Elements */}
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

      <Card className="relative z-10 w-full max-w-[540px] rounded-[2.5rem] bg-surface-dark shadow-2xl border-gray-800 p-12 flex flex-col items-center text-center animate-fade-in-up">
        <IconAvatar
          size="2xl"
          variant="danger"
          className="mb-8 shadow-[0_0_40px_rgba(239,68,68,0.15)] bg-red-500/10"
        >
          <Icon name="explore_off" className="text-6xl text-red-500" />
        </IconAvatar>

        <h1 className="text-7xl font-black text-white uppercase tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-4">
          Page Not Found
        </h2>

        <p className="text-text-secondary text-base font-medium mb-10 leading-relaxed max-w-sm">
          The requested coordinate does not exist in our system. You might have taken a wrong turn in the curriculum.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-gray-700 bg-transparent text-white text-sm font-bold uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all"
          >
            <Icon name="arrow_back" className="mr-2" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="flex-1 h-14 rounded-2xl bg-primary text-background-dark text-sm font-bold uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            <Icon name="home" className="mr-2" />
            Dashboard
          </Button>
        </div>
      </Card>

      {/* Decorative footer */}
      <div className="mt-8 text-gray-600 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3">
        <span className="h-px w-8 bg-gray-800"></span>
        Lost in the Matrix
        <span className="h-px w-8 bg-gray-800"></span>
      </div>
    </div>
  );
};

export default NotFoundPage;
