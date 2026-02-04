import React from 'react';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui';

import type { SecondaryButtonProps } from './types';

/**
 * SecondaryButton - Pre-configured secondary/outline button
 *
 * @example
 * <SecondaryButton onClick={handleCancel}>
 *   Cancel
 * </SecondaryButton>
 */
export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ children, loading, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        disabled={disabled || loading}
        className={className}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" inline />
            {children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

SecondaryButton.displayName = 'SecondaryButton';
