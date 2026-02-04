import { useEffect } from 'react';

import { IconButton, PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import { Form, FormInput, FormTextarea, useZodForm } from '@/components/shared/Form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  VisuallyHidden,
} from '@/components/ui';
import { outreachEmailSchema, type OutreachEmailInput } from '@/lib/validations';

// Base type for students that can receive outreach emails
interface OutreachStudent {
  name: string;
}

interface OutreachEmailModalProps<T extends OutreachStudent> {
  students: T[];
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
}

export const OutreachEmailModal = <T extends OutreachStudent>({
  students,
  isOpen,
  onClose,
  onSend,
}: OutreachEmailModalProps<T>) => {
  const form = useZodForm<OutreachEmailInput>({
    schema: outreachEmailSchema,
    defaultValues: {
      subject: 'Urgent: Bootcamp Progress Update',
      body: '',
    },
  });

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        subject: 'Urgent: Bootcamp Progress Update',
        body: '',
      });
    }
  }, [isOpen, form]);

  if (students.length === 0) return null;

  const handleSubmit = (data: OutreachEmailInput) => {
    onSend(data.subject, data.body);
    form.reset();
  };

  const recipientNames = students.map((s) => s.name).join(', ');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <VisuallyHidden>
          <DialogTitle>Compose Outreach Email to {recipientNames}</DialogTitle>
          <DialogDescription>Send an outreach email to selected students</DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col p-12">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white uppercase">
                COMPOSE OUTREACH
              </h3>
              <p className="text-text-secondary line-clamp-2 text-sm font-medium">
                To: {recipientNames}
              </p>
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
              placeholder="Your message..."
              className="h-48 border-gray-700 bg-white/5"
              error={errors.body?.message}
              required
              {...register('body')}
            />
            <div className="flex gap-4">
              <PrimaryButton type="submit" loading={isSubmitting} className="flex-[2]">
                SEND EMAIL ({students.length})
              </PrimaryButton>
              <SecondaryButton type="button" onClick={onClose} className="flex-1">
                DISCARD
              </SecondaryButton>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
