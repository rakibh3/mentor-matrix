import React from 'react';
import { Icon } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import { Form, FormSelect, FormTextarea } from '@/components/shared/Form';
import { BackgroundGlow, Card, IconAvatar } from '@/components/ui';

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

  const {
    control,
    reset,
    formState: { errors },
  } = form;

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
    <Card className="border-card-border/50 group relative flex flex-col overflow-visible rounded-[2.5rem] bg-[#121d16] p-10 shadow-2xl">
      <BackgroundGlow
        position="top-right"
        size="sm"
        blur="md"
        className="h-64 w-64 rounded-tr-[2.5rem]"
      />
      <div className="relative z-10 mb-10 flex items-start justify-between">
        <div className="flex items-center gap-5">
          <IconAvatar
            variant="primary"
            size="lg"
            className="bg-[#16271e] shadow-inner transition-transform duration-500 group-hover:scale-105"
          >
            <Icon name="event_note" className="text-4xl" />
          </IconAvatar>
          <div className="flex flex-col">
            <p className="text-2xl leading-tight font-black tracking-tight text-white uppercase">
              Session Planner
            </p>
            <p className="text-text-secondary text-xs font-medium opacity-60">
              Push next day's mission to the student dashboard.
            </p>
          </div>
        </div>
      </div>

      <Form form={form} onSubmit={onSubmit} className="contents">
        <div className="relative z-30 mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
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

        <div className="relative z-10 mb-10">
          <FormTextarea
            label="Learning Guideline"
            placeholder="Describe the focus for tomorrow's session..."
            className="bg-background-dark/50 border-card-border/50 focus:border-primary/50 mb-0 h-40 resize-none transition-colors"
            error={errors.guideline?.message}
            {...control.register('guideline')}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row">
          <PrimaryButton
            type="submit"
            size="lg"
            className="group/btn h-14 flex-[3] text-base tracking-[0.2em]"
            loading={isSubmitting}
            loadingText="Broadcasting..."
          >
            <div className="flex items-center gap-3">
              <Icon
                name="send"
                className="text-xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
              <span>Broadcast Task</span>
            </div>
          </PrimaryButton>

          <SecondaryButton
            type="button"
            onClick={handleClear}
            size="lg"
            className="border-card-border/50 h-14 flex-1 text-base tracking-[0.2em] hover:bg-white/5 hover:text-white"
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
