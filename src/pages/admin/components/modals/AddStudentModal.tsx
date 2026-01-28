import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, IconAvatar, VisuallyHidden } from '@/components/ui';

import { Icon } from '@/constants';

import type { AdminStudent } from '@/types';
import { createStudentSchema, type CreateStudentInput } from '@/lib/validations';
import { Form, FormInput, FormSelect, useZodForm } from '@/components/shared/Form';
import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentData: Partial<AdminStudent>) => void;
}

const COHORT_OPTIONS = [
  { value: '12', label: 'Cohort 12' },
  { value: '11', label: 'Cohort 11' },
  { value: '10', label: 'Cohort 10' },
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const form = useZodForm<CreateStudentInput>({
    schema: createStudentSchema,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      discord: '',
      cohort: '12',
      status: 'Active',
    },
  });
  
  const { register, control, formState: { errors, isSubmitting } } = form;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (data: CreateStudentInput) => {
    onConfirm({
      ...data,
      completedAssignments: [],
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="2xl">
        <VisuallyHidden>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Register a new student into the portal</DialogDescription>
        </VisuallyHidden>
        <div className="p-10 flex flex-col">
          <div className="flex items-center gap-6 mb-10">
            <IconAvatar size="xl">
              <Icon name="person_add" className="text-4xl" />
            </IconAvatar>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">Add New Student</h3>
              <p className="text-text-secondary text-base">Register a new student into the portal</p>
            </div>
          </div>

          <Form form={form} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              placeholder="e.g. John Doe"
              error={errors.name?.message}
              required
              className="md:col-span-2"
              {...register('name')}
            />
            
            <FormInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />
            
            <FormInput
              label="Phone Number"
              type="tel"
              placeholder="01XXXXXXXXX"
              error={errors.phone?.message}
              required
              {...register('phone')}
            />
            
            <FormSelect
              name="cohort"
              control={control}
              label="Cohort"
              options={COHORT_OPTIONS}
              error={errors.cohort?.message}
              placeholder="Select cohort"
            />
            
            <FormInput
              label="Discord Username"
              placeholder="e.g. user#1234"
              error={errors.discord?.message}
              required
              {...register('discord')}
            />

            <div className="md:col-span-2 flex gap-4 mt-6">
              <PrimaryButton 
                type="submit" 
                loading={isSubmitting}
                className="flex-1"
              >
                Confirm Registration
              </PrimaryButton>
              <SecondaryButton 
                type="button" 
                onClick={handleClose} 
                className="flex-1"
              >
                Cancel
              </SecondaryButton>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
