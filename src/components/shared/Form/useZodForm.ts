import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldValues, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

/**
 * Props for useZodForm hook
 */
export interface UseZodFormProps<TFormValues extends FieldValues, TContext = unknown> extends Omit<
  UseFormProps<TFormValues, TContext>,
  'resolver'
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<TFormValues, any, any>;
}

/**
 * Return type for useZodForm - same as react-hook-form's UseFormReturn
 */
export type UseZodFormReturn<TFormValues extends FieldValues> = UseFormReturn<TFormValues>;

export function useZodForm<TFormValues extends FieldValues, TContext = unknown>({
  schema,
  mode = 'onTouched',
  ...formProps
}: UseZodFormProps<TFormValues, TContext>): UseZodFormReturn<TFormValues> {
  return useForm<TFormValues, TContext>({
    mode,
    ...formProps,
    resolver: zodResolver(schema),
  });
}
