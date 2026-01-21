import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "w-full text-sm font-medium outline-none resize-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-xl border border-card-border bg-background-dark/50 text-white p-5 focus:border-primary focus:ring-1 focus:ring-primary/30",
        filled:
          "rounded-2xl bg-background-dark/50 border border-card-border p-6 text-white focus:border-primary focus:ring-1 focus:ring-primary/40",
        planner:
          "rounded-[1.5rem] border border-card-border/30 bg-[#0c1310] text-white p-6 leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary/40 placeholder:text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

// eslint-disable-next-line react-refresh/only-export-components
export { Textarea, textareaVariants }
