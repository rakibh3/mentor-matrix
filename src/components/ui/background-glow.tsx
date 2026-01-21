import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const backgroundGlowVariants = cva(
  "absolute pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary/5",
        "primary-strong": "bg-primary/10",
      },
      size: {
        sm: "w-32 h-32",
        md: "w-48 h-48",
        lg: "w-64 h-64",
        xl: "size-[600px]",
        "2xl": "size-[800px]",
      },
      blur: {
        none: "",
        md: "blur-[60px]",
        lg: "blur-[80px]",
        xl: "blur-[120px]",
        "2xl": "blur-[150px]",
        "3xl": "blur-3xl",
      },
      position: {
        "top-left": "-top-[20%] -left-[10%]",
        "top-right": "top-0 right-0",
        "bottom-right": "-bottom-64 -right-64",
        "center-right": "top-[40%] -right-[10%]",
        "top-left-fixed": "top-20 -left-64",
      },
      shape: {
        circle: "rounded-full",
        "corner-bl": "rounded-bl-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      blur: "xl",
      position: "top-left",
      shape: "circle",
    },
  }
)

export interface BackgroundGlowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof backgroundGlowVariants> {
  fixed?: boolean
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
        fixed && "fixed z-0",
        className
      )} 
      {...props}
    />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { BackgroundGlow, backgroundGlowVariants }
