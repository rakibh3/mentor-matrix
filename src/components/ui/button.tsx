import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'focus-visible:ring-primary focus-visible:ring-offset-background-dark inline-flex items-center justify-center gap-2 font-black tracking-widest whitespace-nowrap uppercase transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-background-dark hover:bg-primary-hover shadow-primary/20 shadow-xl active:scale-95',
        destructive:
          'bg-red-500 text-white shadow-xl shadow-red-500/20 hover:bg-red-600 active:scale-95',
        outline:
          'border-card-border border text-gray-400 hover:bg-white/5 hover:text-white active:scale-95',
        secondary: 'bg-white/5 text-white hover:bg-white/10 active:scale-95',
        ghost: 'text-gray-400 hover:bg-white/5 hover:text-white',
        link: 'text-primary hover:text-primary-hover underline-offset-4 hover:underline',
        icon: 'text-text-secondary hover:bg-white/5 hover:text-white',
      },
      size: {
        default: 'h-14 rounded-2xl px-8 text-sm',
        sm: 'h-10 rounded-xl px-4 text-xs',
        lg: 'h-16 rounded-2xl px-10 text-sm',
        icon: 'size-10 rounded-xl',
        'icon-lg': 'size-12 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
