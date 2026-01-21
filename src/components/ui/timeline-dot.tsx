import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const timelineDotVariants = cva(
  "size-5 rounded-full border-4 border-surface-dark z-10 flex-shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary",
        danger: "bg-red-500",
        warning: "bg-amber-500",
        success: "bg-green-500",
        info: "bg-chart-blue",
        default: "bg-gray-500",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {}

function TimelineDot({ 
  className, 
  variant, 
  ...props 
}: TimelineDotProps) {
  return (
    <div 
      className={cn(timelineDotVariants({ variant }), className)} 
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { TimelineDot, timelineDotVariants }
