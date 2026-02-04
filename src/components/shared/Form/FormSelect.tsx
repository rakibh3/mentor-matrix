import { Icon } from '@/constants';
import { Controller, type FieldValues } from 'react-hook-form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

import type { FormSelectProps } from './types';

/**
 * FormSelect - Reusable select component with react-hook-form Controller integration
 *
 * @example
 * <FormSelect
 *   name="selectedModule"
 *   control={control}
 *   label="Current Module"
 *   icon="layers"
 *   options={[
 *     { value: 'module1', label: 'Module 1' },
 *     { value: 'module2', label: 'Module 2' },
 *   ]}
 *   error={errors.selectedModule?.message}
 * />
 */
export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  error,
  helpText,
  required,
  options,
  placeholder,
  icon,
  disabled,
  containerClassName,
  className,
}: FormSelectProps<T>) {
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

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <SelectTrigger icon={icon} className={className}>
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && <p className="px-1 text-xs font-medium text-red-400">{error}</p>}

      {helpText && !error && (
        <p className="text-text-secondary px-1 text-xs font-medium">{helpText}</p>
      )}
    </div>
  );
}

FormSelect.displayName = 'FormSelect';
