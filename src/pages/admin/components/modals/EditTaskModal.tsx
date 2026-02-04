import { useEffect } from 'react';
import { Icon } from '@/constants';
import type { Task } from '@/types';

import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import { Form, FormSelect, FormTextarea, useZodForm } from '@/components/shared/Form';
import {
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  IconAvatar,
  VisuallyHidden,
} from '@/components/ui';
import {
  editTaskSchema,
  MISSION_NUMBERS,
  MODULE_NUMBERS,
  type EditTaskInput,
} from '@/lib/validations';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
}

const MODULE_OPTIONS = MODULE_NUMBERS.map((n) => ({ value: n.toString(), label: `Module ${n}` }));
const MISSION_OPTIONS = MISSION_NUMBERS.map((n) => ({
  value: n.toString(),
  label: `Mission ${n}`,
}));

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const form = useZodForm<EditTaskInput>({
    schema: editTaskSchema,
    defaultValues: {
      moduleNumber: 1,
      mission: 1,
      guideline: '',
      dueDate: '',
    },
  });

  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;

  // Reset form with task data when task changes or modal opens
  useEffect(() => {
    if (task && isOpen) {
      form.reset({
        moduleNumber: String(task.moduleNumber),
        mission: String(task.mission),
        guideline: task.guideline,
        dueDate: task.dueDate,
      } as any);
    }
  }, [task, isOpen, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!task) return null;

  const handleSubmit = (data: EditTaskInput) => {
    const updatedTask: Task = {
      ...task,
      moduleNumber: data.moduleNumber,
      mission: data.mission,
      guideline: data.guideline,
      dueDate: data.dueDate,
    };
    onSave(updatedTask);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="2xl">
        <VisuallyHidden>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>Updating details for Mission {task.mission}</DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col p-10">
          <div className="mb-10 flex items-center gap-6">
            <IconAvatar size="xl">
              <Icon name="edit_document" className="text-4xl" />
            </IconAvatar>
            <div>
              <h3 className="text-3xl font-black tracking-tight text-white uppercase">
                Edit Assignment
              </h3>
              <p className="text-text-secondary text-base">
                Updating details for Mission {form.watch('mission')}
              </p>
            </div>
          </div>

          <Form
            form={form}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <FormSelect
              name="moduleNumber"
              control={control}
              label="Module #"
              options={MODULE_OPTIONS}
              placeholder="Select module"
              error={errors.moduleNumber?.message}
            />

            <FormSelect
              name="mission"
              control={control}
              label="Mission #"
              options={MISSION_OPTIONS}
              placeholder="Select mission"
              error={errors.mission?.message}
            />

            <FormTextarea
              label="Guideline"
              placeholder="Enter guidelines..."
              className="text-text-secondary h-32 border-gray-700 bg-white/5"
              containerClassName="md:col-span-2"
              error={errors.guideline?.message}
              required
              {...register('guideline')}
            />

            <div className="group/field flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center gap-2 px-1">
                <span className="group-focus-within/field:text-primary text-[10px] font-black tracking-widest text-gray-500 uppercase transition-colors">
                  Due Date
                </span>
              </div>
              <DatePicker
                value={form.watch('dueDate')}
                onChange={(val) => form.setValue('dueDate', val, { shouldValidate: true })}
              />
              {errors.dueDate && (
                <p className="px-1 text-xs font-medium text-red-400">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="mt-6 flex gap-4 md:col-span-2">
              <PrimaryButton type="submit" loading={isSubmitting} className="flex-1">
                Save Changes
              </PrimaryButton>
              <SecondaryButton type="button" onClick={handleClose} className="flex-1">
                Cancel
              </SecondaryButton>
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
