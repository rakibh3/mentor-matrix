import * as React from 'react';

import { cn } from '@/lib/utils';

export interface UploadCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
}

function UploadCard({ className, icon, label, ...props }: UploadCardProps) {
  return (
    <div
      className={cn(
        'bg-background-dark/50 border-card-border group hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-2xl border p-6 transition-all',
        className
      )}
      {...props}
    >
      {icon}
      <span className="text-xs font-black tracking-widest uppercase">{label}</span>
    </div>
  );
}

export { UploadCard };
