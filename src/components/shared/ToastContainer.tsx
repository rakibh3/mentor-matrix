import React from 'react';
import { useToast, ToastType } from '@/context/ToastContext';
import { Icon } from '@/constants';

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success': return <Icon name="check_circle" className="text-primary" />;
    case 'error': return <Icon name="error" className="text-red-500" />;
    case 'warning': return <Icon name="warning" className="text-amber-500" />;
    default: return <Icon name="info" className="text-chart-blue" />;
  }
};

const ToastItem = ({ id, type, title, message, duration }: { id: string; type: ToastType; title: string; message: string; duration?: number }) => {
  const { removeToast } = useToast();

  const borderColor = {
    success: 'border-primary/30',
    error: 'border-red-500/30',
    warning: 'border-amber-500/30',
    info: 'border-chart-blue/30'
  }[type];

  const glowColor = {
    success: 'shadow-primary/10',
    error: 'shadow-red-500/10',
    warning: 'shadow-amber-500/10',
    info: 'shadow-chart-blue/10'
  }[type];

  const progressColor = {
    success: 'bg-primary',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-chart-blue'
  }[type];

  return (
    <div className={`relative w-80 sm:w-96 overflow-hidden rounded-[1.5rem] bg-surface-dark/80 backdrop-blur-xl border ${borderColor} shadow-2xl ${glowColor} animate-fade-in-right`}>
      <div className="p-5 flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          <ToastIcon type={type} />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="text-sm font-black text-white uppercase tracking-tight">{title}</h4>
          <p className="text-sm text-text-secondary font-medium mt-1 leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={() => removeToast(id)}
          className="flex-shrink-0 p-1 text-gray-500 hover:text-white transition-colors"
        >
          <Icon name="close" className="text-base" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
        <div 
          className={`h-full ${progressColor} transition-all ease-linear`}
          style={{ 
            animation: `toast-progress ${duration}ms linear forwards`
          }}
        />
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} />
        </div>
      ))}
    </div>
  );
};