import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormMessageProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  className?: string;
}

/**
 * Standalone form error message component
 * Use this when you need to display errors separately from the input
 * 
 * @example
 * ```tsx
 * <Input {...register('email')} />
 * <FormMessage<FormData> name="email" />
 * ```
 */
export function FormMessage<TFieldValues extends FieldValues = FieldValues>({
  name,
  className,
}: FormMessageProps<TFieldValues>) {
  const { formState: { errors } } = useFormContext<TFieldValues>();
  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  if (!errorMessage) return null;

  return (
    <p className={cn('text-xs font-medium text-red-500', className)} role="alert">
      {errorMessage}
    </p>
  );
}
