import * as React from "react"

import { cn } from "@/lib/utils"

export interface DonutChartSegment {
  value: number
  className?: string
}

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: DonutChartSegment[]
  size?: "sm" | "md" | "lg" | "xl"
  strokeWidth?: number
  children?: React.ReactNode
}

const sizeMap = {
  sm: "size-32",
  md: "size-40",
  lg: "size-48",
  xl: "size-56",
}

function DonutChart({ 
  className, 
  segments,
  size = "xl",
  strokeWidth = 3,
  children,
  ...props 
}: DonutChartProps) {
  // Calculate dasharray offsets for each segment using reduce
  const processedSegments = segments.reduce<Array<DonutChartSegment & { dasharray: string; dashoffset: number }>>((acc, segment) => {
    const cumulativeOffset = acc.reduce((sum, s) => sum + segments[acc.indexOf(s)].value, 0)
    acc.push({
      ...segment,
      dasharray: `${segment.value}, 100`,
      dashoffset: cumulativeOffset === 0 ? 0 : -cumulativeOffset,
    })
    return acc
  }, [])

  return (
    <div 
      className={cn("relative", sizeMap[size], className)} 
      {...props}
    >
      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle 
          cx="18" 
          cy="18" 
          r="16" 
          fill="none" 
          className="stroke-background-dark" 
          strokeWidth={strokeWidth}
        />
        {/* Segment circles */}
        {processedSegments.map((segment, index) => (
          <circle 
            key={index}
            cx="18" 
            cy="18" 
            r="16" 
            fill="none" 
            className={segment.className || "stroke-primary"}
            strokeWidth={strokeWidth}
            strokeDasharray={segment.dasharray}
            strokeDashoffset={segment.dashoffset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

export { DonutChart }
