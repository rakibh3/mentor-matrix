import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full text-white transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-background-dark/50 border-card-border focus:border-primary focus:ring-primary h-14 rounded-2xl border px-6 text-sm font-bold placeholder:text-gray-600 focus:ring-1',
        filled:
          'focus:border-primary focus:ring-primary h-14 rounded-2xl border border-gray-700 bg-[#111814] px-6 text-sm font-medium placeholder:text-gray-400 focus:ring-1',
        otp: 'focus:border-primary focus:ring-primary h-12 w-10 rounded-lg border border-gray-700 bg-[#111814] text-center text-xl font-bold placeholder:text-gray-500 focus:ring-1 sm:h-14 sm:w-12',
        search:
          'focus:border-primary h-10 rounded-xl border border-transparent bg-white/5 px-4 text-sm font-medium placeholder:text-gray-500 focus:bg-white/10',
      },
      hasIcon: {
        left: 'pl-11',
        right: 'pr-11',
        both: 'pr-11 pl-11',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      hasIcon: 'none',
    },
  }
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, hasIcon, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, hasIcon, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// eslint-disable-next-line react-refresh/only-export-components
export { Input, inputVariants };
