import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const statusDotVariants = cva('flex-shrink-0 rounded-full', {
  variants: {
    variant: {
      primary: 'bg-primary',
      danger: 'bg-red-500',
      warning: 'bg-amber-500',
      success: 'bg-green-500',
      info: 'bg-chart-blue',
      inactive: 'bg-gray-700',
    },
    size: {
      xs: 'size-1.5',
      sm: 'size-2',
      md: 'size-3',
      lg: 'size-6',
    },
    pulse: {
      true: 'animate-pulse',
      false: '',
    },
    glow: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      glow: true,
      className: 'shadow-[0_0_8px_#13ec6a]',
    },
    {
      variant: 'danger',
      glow: true,
      className: 'shadow-[0_0_8px_#ef4444]',
    },
    {
      variant: 'warning',
      glow: true,
      className: 'shadow-[0_0_8px_#f59e0b]',
    },
    {
      variant: 'success',
      glow: true,
      className: 'shadow-[0_0_8px_#22c55e]',
    },
    {
      variant: 'info',
      glow: true,
      className: 'shadow-[0_0_8px_#3b82f6]',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
    pulse: false,
    glow: false,
  },
});

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusDotVariants> {}

function StatusDot({ className, variant, size, pulse, glow, ...props }: StatusDotProps) {
  return (
    <span
      className={cn(statusDotVariants({ variant, size, pulse, glow }), 'inline-block', className)}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { StatusDot, statusDotVariants };
