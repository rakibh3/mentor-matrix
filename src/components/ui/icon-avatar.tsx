import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const iconAvatarVariants = cva('flex items-center justify-center transition-colors', {
  variants: {
    variant: {
      primary: 'bg-primary/10 text-primary border-primary/20',
      danger: 'border-red-500/20 bg-red-500/10 text-red-500',
      warning: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
      success: 'border-green-500/20 bg-green-500/10 text-green-400',
      default: 'border-white/10 bg-white/5 text-gray-500',
      blue: 'bg-chart-blue/10 text-chart-blue border-chart-blue/20',
      inverted: 'text-background-dark border-white/20 bg-white',
    },
    size: {
      xs: 'size-8 rounded-lg text-sm',
      sm: 'size-10 rounded-xl text-xl',
      md: 'size-12 rounded-2xl text-2xl',
      'md-lg': 'size-14 rounded-2xl text-2xl',
      lg: 'size-16 rounded-2xl text-3xl',
      xl: 'size-20 rounded-[2rem] text-4xl',
      '2xl': 'size-24 rounded-3xl text-5xl',
    },
    bordered: {
      true: 'border',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'xl',
    bordered: true,
  },
});

export interface IconAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof iconAvatarVariants> {}

function IconAvatar({ className, variant, size, bordered, children, ...props }: IconAvatarProps) {
  return (
    <div className={cn(iconAvatarVariants({ variant, size, bordered }), className)} {...props}>
      {children}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { IconAvatar, iconAvatarVariants };
