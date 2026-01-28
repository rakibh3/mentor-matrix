
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@/constants';
import { BackgroundGlow, Card, IconAvatar } from '@/components/ui';


import { Form, FormSelect, FormTextarea } from '@/components/shared/Form';
import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';

const taskSchema = z.object({
  module: z.string().min(1, 'Module is required'),
  mission: z.string().min(1, 'Mission is required'),
  guideline: z.string().min(1, 'Guideline is required'),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskPlannerProps {
  defaultModule?: string;
  defaultMission?: string;
  onBroadcast: (data: TaskFormData) => void;
  isSubmitting?: boolean;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({
  defaultModule = 'Module 5',
  defaultMission = 'Mission 1',
  onBroadcast,
  isSubmitting = false,
}) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      module: defaultModule,
      mission: defaultMission,
      guideline: '',
    },
  });

  const { control, reset, formState: { errors } } = form;

  const onSubmit = (data: TaskFormData) => {
    onBroadcast(data);
  };

  const handleClear = () => {
    reset({
      module: defaultModule,
      mission: defaultMission,
      guideline: '',
    });
  };

  const moduleOptions = Array.from({ length: 6 }, (_, i) => ({
    value: `Module ${i + 1}`,
    label: `Module ${i + 1}`,
  }));

  const missionOptions = Array.from({ length: 8 }, (_, i) => ({
    value: `Mission ${i + 1}`,
    label: `Mission ${i + 1}`,
  }));

  return (
    <Card className="flex flex-col rounded-[2.5rem] border-card-border/50 bg-[#121d16] p-10 shadow-2xl relative group overflow-visible">
      <BackgroundGlow position="top-right" size="sm" blur="md" className="w-64 h-64 rounded-tr-[2.5rem]" />
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex gap-5 items-center">
          <IconAvatar variant="primary" size="lg" className="bg-[#16271e] shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Icon name="event_note" className="text-4xl" />
          </IconAvatar>
          <div className="flex flex-col">
            <p className="text-white text-2xl font-black leading-tight tracking-tight uppercase">Session Planner</p>
            <p className="text-text-secondary text-xs font-medium opacity-60">Push next day's mission to the student dashboard.</p>
          </div>
        </div>
      </div>

      <Form form={form} onSubmit={onSubmit} className="contents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-30">
          <FormSelect
            name="module"
            control={control}
            label="Curriculum Module"
            options={moduleOptions}
            icon="layers"
            placeholder="Select module"
            error={errors.module?.message}
          />
          <FormSelect
            name="mission"
            control={control}
            label="Active Mission"
            options={missionOptions}
            icon="rocket_launch"
            placeholder="Select mission"
            error={errors.mission?.message}
          />
        </div>

        <div className="mb-10 relative z-10">
          <FormTextarea
            label="Learning Guideline"
            placeholder="Describe the focus for tomorrow's session..."
            className="h-40 bg-background-dark/50 border-card-border/50 focus:border-primary/50 transition-colors resize-none mb-0"
            error={errors.guideline?.message}
            {...control.register('guideline')}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <PrimaryButton
            type="submit"
            size="lg"
            className="flex-[3] tracking-[0.2em] group/btn h-14 text-base"
            loading={isSubmitting}
            loadingText="Broadcasting..."
          >
            <div className="flex items-center gap-3">
              <Icon name="send" className="text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <span>Broadcast Task</span>
            </div>
          </PrimaryButton>
          
          <SecondaryButton
            type="button"
            onClick={handleClear}
            size="lg"
            className="flex-1 tracking-[0.2em] h-14 text-base border-card-border/50 hover:bg-white/5 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Icon name="refresh" className="text-xl" />
              <span>Clear</span>
            </div>
          </SecondaryButton>
        </div>
      </Form>
    </Card>
  );
};
