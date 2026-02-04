import * as React from 'react';

import { cn } from '@/lib/utils';

type TimelineLineProps = React.HTMLAttributes<HTMLDivElement>;

function TimelineLine({ className, ...props }: TimelineLineProps) {
  return <div className={cn('bg-card-border/50 absolute w-px', className)} {...props} />;
}

export { TimelineLine };
