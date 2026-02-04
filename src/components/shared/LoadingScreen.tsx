import React from 'react';

import { BackgroundGlow } from '@/components/ui';
import { cn } from '@/lib/utils';

import { LoadingSpinner } from './LoadingSpinner';

interface LoadingScreenProps {
  label?: string;
  variant?: 'primary' | 'dark';
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  label = 'Synchronizing...',
  variant = 'primary',
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0a120d] transition-all duration-500',
        className
      )}
    >
      {/* Immersive Background */}
      <BackgroundGlow position="top-left" size="xl" blur="xl" variant="primary" fixed />
      <BackgroundGlow position="bottom-right" size="2xl" blur="2xl" variant="primary" fixed />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <LoadingSpinner size="lg" variant={variant} fullHeight={false} />
        <p className="text-text-secondary text-sm font-medium">{label}</p>

        {/* Hacker/Modern Decorative elements */}
        <div className="mt-4 flex flex-col items-center gap-2 opacity-20">
          <div className="via-primary h-px w-32 bg-gradient-to-r from-transparent to-transparent" />
          <p className="text-primary text-[10px] font-black tracking-[0.5em] uppercase">
            Secure Session Active
          </p>
        </div>
      </div>

      {/* Progress Bars in corners for aesthetic */}
      <div className="absolute top-10 left-10 flex gap-1 opacity-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-primary h-8 w-1 animate-pulse rounded-full"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
      <div className="absolute right-10 bottom-10 flex rotate-180 gap-1 opacity-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-primary h-8 w-1 animate-pulse rounded-full"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
};
