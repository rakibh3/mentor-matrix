import React from 'react';
import { Icon } from '@/constants';

import { Input } from '@/components/ui';

import type { FormInputProps } from './types';

/**
 * FormInput - Reusable input component with label, error, and icon support
 *
 * @example
 * <FormInput
 *   label="Email Address"
 *   error={errors.email?.message}
 *   icon="mail"
 *   iconPosition="left"
 *   {...register('email')}
 * />
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helpText,
      required,
      icon,
      iconPosition = 'left',
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const hasIcon = icon ? iconPosition : 'none';

    return (
      <div className={`group/field flex flex-col gap-3 ${containerClassName || ''}`}>
        {label && (
          <div className="flex items-center gap-2 px-1">
            {icon && (
              <Icon
                name={icon}
                className="text-primary/60 group-focus-within/field:text-primary text-xs transition-colors"
              />
            )}
            <label className="group-focus-within/field:text-primary text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors">
              {label}
              {required && <span className="ml-1 text-red-400">*</span>}
            </label>
          </div>
        )}

        <div className="relative">
          <Input ref={ref} hasIcon={hasIcon} className={className} {...props} />
        </div>

        {error && <p className="px-1 text-xs font-medium text-red-400">{error}</p>}

        {helpText && !error && (
          <p className="text-text-secondary px-1 text-xs font-medium">{helpText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
