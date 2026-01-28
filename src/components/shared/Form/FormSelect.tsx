import { Controller, type FieldValues } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Icon } from '@/constants';
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
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
            disabled={disabled}
          >
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

      {error && (
        <p className="text-red-400 text-xs font-medium px-1">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-text-secondary text-xs font-medium px-1">{helpText}</p>
      )}
    </div>
  );
}

FormSelect.displayName = 'FormSelect';
