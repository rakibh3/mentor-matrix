import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const backgroundGlowVariants = cva('pointer-events-none absolute', {
  variants: {
    variant: {
      primary: 'bg-primary/5',
      'primary-strong': 'bg-primary/10',
    },
    size: {
      sm: 'h-32 w-32',
      md: 'h-48 w-48',
      lg: 'h-64 w-64',
      xl: 'size-[600px]',
      '2xl': 'size-[800px]',
    },
    blur: {
      none: '',
      md: 'blur-[60px]',
      lg: 'blur-[80px]',
      xl: 'blur-[120px]',
      '2xl': 'blur-[150px]',
      '3xl': 'blur-3xl',
    },
    position: {
      'top-left': '-top-[20%] -left-[10%]',
      'top-right': 'top-0 right-0',
      'bottom-right': '-right-64 -bottom-64',
      'center-right': 'top-[40%] -right-[10%]',
      'top-left-fixed': 'top-20 -left-64',
    },
    shape: {
      circle: 'rounded-full',
      'corner-bl': 'rounded-bl-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    blur: 'xl',
    position: 'top-left',
    shape: 'circle',
  },
});

export interface BackgroundGlowProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof backgroundGlowVariants> {
  fixed?: boolean;
}

function BackgroundGlow({
  className,
  variant,
  size,
  blur,
  position,
  shape,
  fixed = false,
  ...props
}: BackgroundGlowProps) {
  return (
    <div
      className={cn(
        backgroundGlowVariants({ variant, size, blur, position, shape }),
        fixed && 'fixed z-0',
        className
      )}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { BackgroundGlow, backgroundGlowVariants };
