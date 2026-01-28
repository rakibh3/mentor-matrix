import React from 'react';
import { Input } from '@/components/ui';
import { Icon } from '@/constants';
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
  ({ label, error, helpText, required, icon, iconPosition = 'left', className, containerClassName, ...props }, ref) => {
    const hasIcon = icon ? iconPosition : 'none';

    return (
      <div className={`flex flex-col gap-3 group/field ${containerClassName || ''}`}>
        {label && (
          <div className="flex items-center gap-2 px-1">
            {icon && (
              <Icon 
                name={icon} 
                className="text-xs text-primary/60 group-focus-within/field:text-primary transition-colors" 
              />
            )}
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within/field:text-primary transition-colors">
              {label}
              {required && <span className="text-red-400 ml-1">*</span>}
            </label>
          </div>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            hasIcon={hasIcon}
            className={className}
            {...props}
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs font-medium px-1">{error}</p>
        )}
        
        {helpText && !error && (
          <p className="text-text-secondary text-xs font-medium px-1">{helpText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
