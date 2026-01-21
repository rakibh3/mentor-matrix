import * as React from "react"

import { cn } from "@/lib/utils"

export interface UploadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  label: string
}

function UploadCard({ 
  className, 
  icon,
  label,
  ...props 
}: UploadCardProps) {
  return (
    <div 
      className={cn(
        "p-6 rounded-2xl bg-background-dark/50 border border-card-border flex flex-col items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all",
        className
      )} 
      {...props}
    >
      {icon}
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </div>
  )
}

export { UploadCard }
