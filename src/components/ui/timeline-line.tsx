import * as React from "react"

import { cn } from "@/lib/utils"

type TimelineLineProps = React.HTMLAttributes<HTMLDivElement>

function TimelineLine({ 
  className, 
  ...props 
}: TimelineLineProps) {
  return (
    <div 
      className={cn(
        "absolute w-px bg-card-border/50",
        className
      )} 
      {...props}
    />
  )
}

export { TimelineLine }
