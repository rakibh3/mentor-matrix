import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'w-full resize-none text-sm font-medium transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-card-border bg-background-dark/50 focus:border-primary focus:ring-primary/30 rounded-xl border p-5 text-white focus:ring-1',
        filled:
          'bg-background-dark/50 border-card-border focus:border-primary focus:ring-primary/40 rounded-2xl border p-6 text-white focus:ring-1',
        planner:
          'border-card-border/30 focus:border-primary focus:ring-primary/40 rounded-[1.5rem] border bg-[#0c1310] p-6 leading-relaxed text-white placeholder:text-gray-800 focus:ring-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea className={cn(textareaVariants({ variant, className }))} ref={ref} {...props} />
    );
  }
);
Textarea.displayName = 'Textarea';

// eslint-disable-next-line react-refresh/only-export-components
export { Textarea, textareaVariants };
