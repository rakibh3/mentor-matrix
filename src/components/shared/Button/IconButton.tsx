import React from 'react';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';

import { Icon } from '@/constants';
import type { IconButtonProps } from './types';

/**
 * IconButton - Icon-only button with optional tooltip
 * 
 * @example
 * <IconButton 
 *   icon="delete" 
 *   tooltip="Delete item"
 *   onClick={handleDelete}
 * />
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, tooltip, tooltipSide = 'top', size = 'icon', variant = 'icon', className, ...props }, ref) => {
    const button = (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        <Icon name={icon} className="text-xl" />
      </Button>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  }
);

IconButton.displayName = 'IconButton';
