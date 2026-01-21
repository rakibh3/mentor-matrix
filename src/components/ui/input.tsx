import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full text-white transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-2xl bg-background-dark/50 border border-card-border px-6 h-14 text-sm font-bold placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary",
        filled:
          "rounded-2xl bg-[#111814] border border-gray-700 px-6 h-14 text-sm font-medium placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary",
        otp:
          "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border border-gray-700 bg-[#111814] placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary",
        search:
          "rounded-xl bg-white/5 border border-transparent px-4 h-10 text-sm font-medium placeholder:text-gray-500 focus:border-primary focus:bg-white/10",
      },
      hasIcon: {
        left: "pl-11",
        right: "pr-11",
        both: "pl-11 pr-11",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hasIcon: "none",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, hasIcon, type = "text", ...props }, ref) => {
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
Input.displayName = "Input";

// eslint-disable-next-line react-refresh/only-export-components
export { Input, inputVariants };
