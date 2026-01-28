import { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconAvatar, VisuallyHidden } from '@/components/ui';

import { Form, FormInput, FormSelect, useZodForm } from '@/components/shared/Form';
import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import { editStudentSchema, STUDENT_STATUSES, type EditStudentInput, type StudentStatus } from '@/lib/validations';

import { Icon } from '@/constants';

// Base type for editable student fields
interface EditableStudent {
  name: string;
  email: string;
  status: StudentStatus;
  cohort?: string;
}

interface EditStudentModalProps<T extends EditableStudent> {
  isOpen: boolean;
  onClose: () => void;
  student: T | null;
  onSave: (updatedStudent: T) => void;
}

// Convert student statuses to select options
const statusOptions = STUDENT_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

export const EditStudentModal = <T extends EditableStudent>({ 
  isOpen, 
  onClose, 
  student, 
  onSave 
}: EditStudentModalProps<T>) => {
  const form = useZodForm<EditStudentInput>({
    schema: editStudentSchema,
    defaultValues: {
      name: '',
      email: '',
      cohort: '',
      status: 'Active',
    },
  });

  const { register, control, formState: { errors, isSubmitting } } = form;

  // Reset form when student changes
  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        email: student.email,
        cohort: student.cohort ?? '',
        status: student.status,
      });
    }
  }, [student, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!student) return null;

  const handleSubmit = (data: EditStudentInput) => {
    // Merge form data with original student to preserve non-editable fields
    const updatedStudent = {
      ...student,
      ...data,
    } as T;
    onSave(updatedStudent);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="2xl">
        <VisuallyHidden>
          <DialogTitle>Edit Student</DialogTitle>
        </VisuallyHidden>
        
        <div className="p-10 flex flex-col">
          <div className="flex items-center gap-6 mb-10">
            <IconAvatar size="xl">
              <Icon name="person_edit" className="text-4xl" />
            </IconAvatar>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">Edit Student</h3>
              <p className="text-text-secondary text-base">Modifying profile for {student.name}</p>
            </div>
          </div>

          <Form form={form} onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <FormInput
              label="Full Name"
              error={errors.name?.message}
              required
              {...register('name')}
            />
            
            <FormInput
              label="Email Address"
              type="email"
              disabled
              className="bg-background-dark/30 border-card-border/50 text-gray-500 cursor-not-allowed"
              {...register('email')}
            />
            
            <FormInput
              label="Cohort"
              error={errors.cohort?.message}
              {...register('cohort')}
            />
            
            <FormSelect
              name="status"
              control={control}
              label="Status"
              options={statusOptions}
              placeholder="Select status"
              error={errors.status?.message}
            />

            <div className="flex gap-4 mt-6">
              <PrimaryButton 
                type="submit" 
                loading={isSubmitting}
                className="flex-1"
              >
                Save Changes
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
