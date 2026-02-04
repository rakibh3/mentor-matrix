import * as React from 'react';

import { IconAvatar, type IconAvatarProps } from '@/components/ui/icon-avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export interface SettingToggleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
  layout?: 'horizontal' | 'vertical';
  iconVariant?: IconAvatarProps['variant'];
}

function SettingToggleCard({
  className,
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  layout = 'horizontal',
  iconVariant,
  ...props
}: SettingToggleCardProps) {
  // Determine icon variant: use provided iconVariant, or fallback to checked-based logic for horizontal
  const computedIconVariant = iconVariant ?? (checked ? 'primary' : 'default');

  if (layout === 'vertical') {
    return (
      <div
        className={cn(
          'bg-background-dark/40 border-card-border group flex cursor-pointer flex-col gap-3 rounded-2xl border p-6 transition-colors hover:bg-white/[0.02]',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={() => !disabled && onCheckedChange()}
        {...props}
      >
        <div className="flex items-center justify-between">
          <IconAvatar variant={computedIconVariant} size="sm" bordered={false}>
            {icon}
          </IconAvatar>
          <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
        </div>
        <h4 className="text-sm font-black tracking-tight text-white uppercase">{title}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{description}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-background-dark/40 border-card-border group flex cursor-pointer items-center justify-between rounded-2xl border p-6 transition-colors hover:bg-white/[0.02]',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={() => !disabled && onCheckedChange()}
      {...props}
    >
      <div className="flex items-center gap-4">
        <IconAvatar variant={computedIconVariant} size="sm" bordered>
          {icon}
        </IconAvatar>
        <div className="flex flex-col gap-1">
          <Label className="cursor-pointer text-sm text-white">{title}</Label>
          <p className="text-text-secondary text-xs font-medium">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} size="lg" disabled={disabled} />
    </div>
  );
}

export { SettingToggleCard };
