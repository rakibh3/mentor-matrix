import React from 'react';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui';

import type { PrimaryButtonProps } from './types';

/**
 * PrimaryButton - Pre-configured primary action button
 *
 * @example
 * <PrimaryButton loading={isSubmitting} onClick={handleSubmit}>
 *   Submit Form
 * </PrimaryButton>
 */
export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, loading, loadingText, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        disabled={disabled || loading}
        className={className}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" variant="dark" inline />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';
