import React from 'react';
import { Icon } from '@/constants';
import { useNavigate } from 'react-router-dom';

import { BackgroundGlow, Button, Card, IconAvatar } from '@/components/ui';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-dark font-display relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 text-white antialiased">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <BackgroundGlow position="top-left" size="md" blur="xl" />
        <BackgroundGlow
          variant="primary-strong"
          position="center-right"
          size="sm"
          blur="lg"
          className="h-[60%] w-[40%]"
        />
      </div>

      <Card className="bg-surface-dark animate-fade-in-up relative z-10 flex w-full max-w-[540px] flex-col items-center rounded-[2.5rem] border-gray-800 p-12 text-center shadow-2xl">
        <IconAvatar
          size="2xl"
          variant="danger"
          className="mb-8 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
        >
          <Icon name="explore_off" className="text-6xl text-red-500" />
        </IconAvatar>

        <h1 className="mb-4 text-7xl font-black tracking-tighter text-white uppercase">404</h1>

        <h2 className="mb-4 text-2xl font-bold tracking-wide text-white uppercase">
          Page Not Found
        </h2>

        <p className="text-text-secondary mb-10 max-w-sm text-base leading-relaxed font-medium">
          The requested coordinate does not exist in our system. You might have taken a wrong turn
          in the curriculum.
        </p>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-14 flex-1 rounded-2xl border-gray-700 bg-transparent text-sm font-bold tracking-widest text-white uppercase transition-all hover:bg-white/5 active:scale-95"
          >
            <Icon name="arrow_back" className="mr-2" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
            className="bg-primary text-background-dark hover:bg-primary-hover shadow-primary/20 h-14 flex-1 rounded-2xl text-sm font-bold tracking-widest uppercase shadow-xl transition-all active:scale-95"
          >
            <Icon name="home" className="mr-2" />
            Dashboard
          </Button>
        </div>
      </Card>

      {/* Decorative footer */}
      <div className="mt-8 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-gray-600 uppercase">
        <span className="h-px w-8 bg-gray-800"></span>
        Lost in the Matrix
        <span className="h-px w-8 bg-gray-800"></span>
      </div>
    </div>
  );
};

export default NotFoundPage;
