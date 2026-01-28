import React from 'react';
import { Textarea } from '@/components/ui';
import { Icon } from '@/constants';
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
      <div className={`flex flex-col gap-3 group/field ${containerClassName || ''}`}>
        {label && (
          <div className="flex items-center gap-2 px-1">
            {icon && (
              <Icon 
                name={icon} 
                className="text-xs text-primary/60 group-focus-within/field:text-primary transition-colors" 
              />
            )}
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-focus-within/field:text-primary transition-colors">
              {label}
              {required && <span className="text-red-400 ml-1">*</span>}
            </span>
          </div>
        )}
        
        <Textarea
          ref={ref}
          className={className}
          {...props}
        />

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

FormTextarea.displayName = 'FormTextarea';
