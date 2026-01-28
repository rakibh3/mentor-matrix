import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, VisuallyHidden } from '@/components/ui';

import { Form, FormInput, FormTextarea, useZodForm } from '@/components/shared/Form';
import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import { outreachEmailSchema, type OutreachEmailInput } from '@/lib/validations';
import { IconButton } from '@/components/shared/Button';

// Base type for students that can receive outreach emails
interface OutreachStudent {
  name: string;
}

interface OutreachEmailModalProps<T extends OutreachStudent> {
  student: T | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
}

export const OutreachEmailModal = <T extends OutreachStudent>({ student, isOpen, onClose, onSend }: OutreachEmailModalProps<T>) => {
  const form = useZodForm<OutreachEmailInput>({
    schema: outreachEmailSchema,
    defaultValues: {
      subject: 'Urgent: Bootcamp Progress Update',
      body: '',
    },
  });

  const { register, formState: { errors, isSubmitting } } = form;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        subject: 'Urgent: Bootcamp Progress Update',
        body: '',
      });
    }
  }, [isOpen, form]);

  if (!student) return null;

  const handleSubmit = (data: OutreachEmailInput) => {
    onSend(data.subject, data.body);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <VisuallyHidden>
          <DialogTitle>Compose Outreach Email to {student.name}</DialogTitle>
          <DialogDescription>Send an outreach email to the student</DialogDescription>
        </VisuallyHidden>
        <div className="p-12 flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">COMPOSE OUTREACH</h3>
              <p className="text-text-secondary text-sm font-medium">To: {student.name}</p>
            </div>
            <IconButton icon="close" onClick={onClose} tooltip="Close" />
          </div>
          <Form form={form} onSubmit={handleSubmit} className="flex flex-col gap-8">
            <FormInput
              label="Subject"
              placeholder="Subject"
              error={errors.subject?.message}
              required
              {...register('subject')}
            />
            <FormTextarea
              label="Message"
              placeholder={`Message to ${student.name}...`}
              className="h-48 bg-white/5 border-gray-700"
              error={errors.body?.message}
              required
              {...register('body')}
            />
            <div className="flex gap-4">
              <PrimaryButton 
                type="submit" 
                loading={isSubmitting}
                className="flex-[2]"
              >
                SEND EMAIL
              </PrimaryButton>
              <SecondaryButton 
                type="button" 
                onClick={onClose} 
                className="flex-1"
              >
                DISCARD
              </SecondaryButton>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
