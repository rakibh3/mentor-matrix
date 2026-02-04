import * as React from 'react';
import { Icon } from '@/constants';
import * as SelectPrimitive from '@radix-ui/react-select';

import { cn } from '@/lib/utils';

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  icon,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  icon?: string;
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'border-card-border/60 bg-surface-dark/40 flex h-auto min-h-[3.5rem] w-full items-center justify-between gap-3 rounded-xl border px-5 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all outline-none',
        'hover:border-primary/50',
        'focus:border-primary focus:ring-primary/30 focus:ring-1',
        'data-[placeholder]:text-gray-600',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 text-left leading-tight break-words whitespace-normal">
        {icon && (
          <Icon
            name={icon}
            className="group-data-[state=open]:text-primary shrink-0 text-xl text-gray-500"
          />
        )}
        {children}
      </div>
      <SelectPrimitive.Icon asChild>
        <Icon
          name="expand_more"
          className="data-[state=open]:text-primary text-gray-500 transition-transform duration-300 data-[state=open]:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'relative z-[200] max-h-[var(--radix-select-content-available-height)] min-w-[8rem] overflow-hidden',
          'bg-surface-dark border-card-border rounded-xl border shadow-2xl backdrop-blur-xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-2 data-[side=top]:-translate-y-2',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'py-2',
            position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'px-5 py-2 text-xs font-black tracking-widest text-gray-500 uppercase',
        className
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-pointer items-center px-5 py-3.5 text-sm font-bold tracking-widest uppercase transition-all outline-none select-none',
        'text-text-secondary',
        'hover:bg-white/5 hover:text-white',
        'focus:bg-white/5 focus:text-white',
        'data-[state=checked]:bg-primary data-[state=checked]:text-background-dark',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-card-border/50 -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-gray-500',
        className
      )}
      {...props}
    >
      <Icon name="expand_less" className="text-lg" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-gray-500',
        className
      )}
      {...props}
    >
      <Icon name="expand_more" className="text-lg" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
