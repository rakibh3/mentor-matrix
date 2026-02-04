import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('border-card-border inline-flex items-center gap-2 border-b', className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center border-b-2 border-transparent px-8 py-4 text-xs font-black tracking-widest whitespace-nowrap uppercase transition-all',
      'text-text-secondary hover:bg-white/5 hover:text-white',
      'data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-primary/5',
      'focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'focus-visible:ring-primary/50 mt-8 focus-visible:ring-2 focus-visible:outline-none',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Styling for navigation tabs (used with React Router Links)
const tabsNavStyles = {
  list: 'flex overflow-x-auto gap-2 border-b border-card-border scrollbar-none',
  trigger: (isActive: boolean) =>
    cn(
      'border-b-2 px-8 py-4 text-xs font-black tracking-widest whitespace-nowrap uppercase transition-all',
      isActive
        ? 'text-primary border-primary bg-primary/5'
        : 'text-text-secondary border-transparent hover:bg-white/5 hover:text-white'
    ),
};

// eslint-disable-next-line react-refresh/only-export-components
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsNavStyles };
