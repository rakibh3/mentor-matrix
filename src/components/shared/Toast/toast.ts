import { toast as sonnerToast } from 'sonner';

import type { ToastOptions } from './types';

/**
 * Enhanced toast utilities with simplified API
 *
 * @example
 * toast.success('Operation completed successfully');
 * toast.error('An error occurred', 'Error');
 * toast.info('New message received');
 * toast.warning('Please review your changes');
 */
export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    sonnerToast.success(title || 'Success', {
      description: message,
      duration: duration || 5000,
    });
  },

  error: (message: string, title?: string, duration?: number) => {
    sonnerToast.error(title || 'Error', {
      description: message,
      duration: duration || 5000,
    });
  },

  info: (message: string, title?: string, duration?: number) => {
    sonnerToast.info(title || 'Info', {
      description: message,
      duration: duration || 5000,
    });
  },

  warning: (message: string, title?: string, duration?: number) => {
    sonnerToast.warning(title || 'Warning', {
      description: message,
      duration: duration || 5000,
    });
  },

  custom: ({ title, message, duration = 5000 }: ToastOptions) => {
    sonnerToast(title || 'Notification', {
      description: message,
      duration,
    });
  },
};

// Re-export useToast hook for backward compatibility
export { useToast } from '@/components/ui/use-toast';
