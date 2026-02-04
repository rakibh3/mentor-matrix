import type { Control, FieldValues, Path } from 'react-hook-form';

import type { InputProps } from '@/components/ui/input';

export interface BaseFormFieldProps {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  containerClassName?: string;
}

export interface FormInputProps extends InputProps, BaseFormFieldProps {
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps<T extends FieldValues> extends BaseFormFieldProps {
  name: Path<T>;
  control: Control<T>;
  options: FormSelectOption[];
  placeholder?: string;
  icon?: string;
  disabled?: boolean;
  className?: string;
}

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFormFieldProps {
  icon?: string;
}
