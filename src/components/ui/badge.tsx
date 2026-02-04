import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black tracking-widest uppercase transition-colors',
  {
    variants: {
      variant: {
        default: 'border border-white/10 bg-white/5 text-gray-400',
        primary: 'bg-primary/10 border-primary/20 text-primary border',
        success: 'border border-green-500/20 bg-green-500/10 text-green-400',
        warning: 'border border-amber-500/20 bg-amber-500/10 text-amber-400',
        danger: 'border border-red-500/20 bg-red-500/10 text-red-400',
        outline: 'border-card-border text-text-secondary border',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
