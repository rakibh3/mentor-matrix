import React from 'react';
import { Icon } from '@/constants';
import { z } from 'zod';

import {
  PrimaryButton,
  SecondaryButton,
} from '@/components/shared/Button';
import {
  Form,
  FormSelect,
  useZodForm,
} from '@/components/shared/Form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  IconAvatar,
} from '@/components/ui';

const bulkAssignSchema = z.object({
  srmId: z.string().min(1, 'Please select an SRM'),
});

type BulkAssignInput = z.infer<typeof bulkAssignSchema>;

interface BulkAssignSrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (srmId: string) => void;
  selectedCount: number;
  srms: { _id: string; name: string }[];
}

export const BulkAssignSrmModal: React.FC<BulkAssignSrmModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  selectedCount,
  srms,
}) => {
  const form = useZodForm<BulkAssignInput>({
    schema: bulkAssignSchema,
    defaultValues: { srmId: '' },
  });

  const {
    control,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = (data: BulkAssignInput) => {
    onAssign(data.srmId);
    form.reset();
  };

  const srmOptions = srms.map((s) => ({ value: s._id, label: s.name }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg">
        <div className="flex flex-col p-10">
          <div className="mb-8 flex items-center gap-6">
            <IconAvatar variant="primary" size="xl">
              <Icon name="person_add" className="text-4xl" />
            </IconAvatar>
            <div>
              <DialogTitle className="text-3xl font-black tracking-tight text-white uppercase">
                Bulk Assign SRM
              </DialogTitle>
              <DialogDescription className="text-text-secondary text-base">
                Assign {selectedCount} selected students to a Relationship Manager
              </DialogDescription>
            </div>
          </div>

          <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
            <FormSelect
              name="srmId"
              control={control}
              label="Select SRM"
              options={srmOptions}
              placeholder="Choose a Relationship Manager"
              error={errors.srmId?.message}
              required
            />

            <div className="mt-6 flex gap-4">
              <PrimaryButton type="submit" size="lg" loading={isSubmitting} className="flex-1">
                Confirm Assignment
              </PrimaryButton>
              <SecondaryButton type="button" size="lg" onClick={onClose} className="flex-1">
                Cancel
              </SecondaryButton>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
