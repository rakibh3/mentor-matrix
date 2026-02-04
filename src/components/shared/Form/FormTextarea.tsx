import React from 'react';
import { Icon } from '@/constants';

import { Textarea } from '@/components/ui';

import type { FormTextareaProps } from './types';

/**
 * FormTextarea - Reusable textarea component with label, error, and icon support
 *
 * @example
 * <FormTextarea
 *   label="Session Notes"
 *   error={errors.note?.message}
 *   icon="notes"
 *   placeholder="What did you learn today?"
 *   {...register('note')}
 * />
 */
export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helpText, required, icon, className, containerClassName, ...props }, ref) => {
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
            <span className="group-focus-within/field:text-primary text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors">
              {label}
              {required && <span className="ml-1 text-red-400">*</span>}
            </span>
          </div>
        )}

        <Textarea ref={ref} className={className} {...props} />

        {error && <p className="px-1 text-xs font-medium text-red-400">{error}</p>}

        {helpText && !error && (
          <p className="text-text-secondary px-1 text-xs font-medium">{helpText}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
