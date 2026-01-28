import type { ButtonProps } from '@/components/ui/button';

export interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
  loadingText?: string;
}

export interface SecondaryButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
}

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  icon: string;
  tooltip?: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'icon' | 'icon-lg';
}
