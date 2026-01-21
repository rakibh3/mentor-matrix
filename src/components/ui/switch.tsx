import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    size?: "default" | "lg"
  }
>(({ className, size = "default", ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-card-border bg-card-border shadow-lg transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
      "data-[state=unchecked]:bg-card-border",
      size === "lg" ? "h-8 w-14" : "h-7 w-12",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full shadow-lg ring-0 transition-transform",
        "data-[state=checked]:bg-background-dark data-[state=unchecked]:bg-white",
        size === "lg" 
          ? "h-6 w-6 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" 
          : "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
