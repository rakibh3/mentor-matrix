import * as React from 'react';
import { FormProvider, type FieldValues, type UseFormReturn } from 'react-hook-form';

interface FormProps<TFormValues extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFormValues>;
  onSubmit: (data: TFormValues) => void | Promise<void>;
  children: React.ReactNode;
}

/**
 * Form wrapper component that provides form context and handles submission
 * 
 * @example
 * ```tsx
 * const form = useZodForm({ schema, defaultValues });
 * 
 * return (
 *   <Form form={form} onSubmit={handleSubmit}>
 *     <FormInput name="email" label="Email" />
 *     <Button type="submit">Submit</Button>
 *   </Form>
 * );
 * ```
 */
export function Form<TFormValues extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<TFormValues>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}
