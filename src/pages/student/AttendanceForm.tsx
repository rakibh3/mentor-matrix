/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Icon } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useMarkAttendance } from '@/api/hooks/attendance/useMarkAttendance';
import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import { Form, FormInput, FormSelect, FormTextarea } from '@/components/shared/Form';
import { Card, CardContent, StatusDot, useToast } from '@/components/ui';
import { attendanceFormSchema } from '@/lib/validations/attendance.schema';

import type { AttendanceFormData } from './types';

interface AttendanceFormProps {
  userId: string;
  onSubmit?: (data: AttendanceFormData) => void;
  isLoaded: boolean;
  className?: string;
}

/**
 * Attendance marking form component
 */
export const AttendanceForm: React.FC<AttendanceFormProps> = ({ isLoaded, userId, className }) => {
  const { addToast } = useToast();
  const { mutate: markAttendance, isPending } = useMarkAttendance();

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      module: '',
      mission: '',
      note: '',
    },
  });

  const {
    register,
    reset,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (data: AttendanceFormData) => {
    if (!userId) {
      addToast({
        type: 'error',
        title: 'Authentication Error',
        message: 'Your student identity could not be verified. Please log in again.',
      });
      return;
    }

    // Prepare the request payload based on API spec
    const attendanceData = {
      studentId: userId,
      status: 'ATTENDED' as const,
      mission: Number(data.mission),
      module: Number(data.module),
      note: data.note,
    };

    markAttendance(attendanceData, {
      onSuccess: (response) => {
        addToast({
          type: 'success',
          title: 'Attendance Recorded',
          message:
            response.message ||
            `Successfully checked in for Module ${data.module}, Mission ${data.mission}.${data.note ? ` Note: ${data.note}` : ''}`,
        });
        reset();
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'An error occurred while marking attendance. Please try again.';
        addToast({
          type: 'error',
          title: 'Failed to Mark Attendance',
          message: errorMessage,
        });
      },
    });
  };

  const handleClear = () => {
    reset();
  };

  return (
    <Card
      className={`group/attendance relative h-full overflow-hidden rounded-[2rem] border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-xl md:rounded-[3rem] ${isLoaded ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'} ${className || ''}`}
    >
      <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover/attendance:opacity-100" />
      <CardContent className="relative z-10 flex h-full flex-col p-8 md:p-10">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6 md:mb-8">
          <h3 className="text-left text-2xl leading-none font-black tracking-tighter text-white uppercase sm:text-3xl md:text-4xl">
            Mark Attendance
          </h3>
          <div className="hover:border-primary/30 flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition-all sm:gap-3 sm:px-5 sm:py-2.5">
            <span className="text-[10px] leading-none font-black tracking-widest text-gray-400 uppercase md:text-xs">
              Active Sync
            </span>
            <StatusDot variant="primary" pulse glow />
          </div>
        </div>

        <Form
          id="attendance-form"
          form={form}
          onSubmit={onSubmit}
          className="flex flex-1 flex-col gap-6 md:gap-8"
        >

          {/* Mission Dropdown Field */}
          <FormSelect
            name="mission"
            control={control}
            label="Module Mission"
            icon="rocket_launch"
            className="focus:border-primary/50 h-auto min-h-[3.5rem] rounded-2xl border-white/10 bg-white/[0.02] py-2 text-sm font-black text-white shadow-inner transition-all focus:bg-white/[0.05] md:text-base"
            placeholder="Select Mission"
            options={[
              { value: '1', label: 'Mission 1' },
              { value: '2', label: 'Mission 2' },
              { value: '3', label: 'Mission 3' },
              { value: '4', label: 'Mission 4' },
              { value: '5', label: 'Mission 5' },
              { value: '6', label: 'Mission 6' },
              { value: '7', label: 'Mission 7' },
              { value: '8', label: 'Mission 8' },
            ]}
            error={errors.mission?.message}
          />

          {/* Module Number Field */}
          <FormInput
            label="Module Number"
            icon="layers"
            placeholder="e.g. 4"
            className="focus:border-primary/50 h-14 rounded-2xl border-white/10 bg-white/[0.02] text-lg font-black tracking-tight text-white shadow-inner transition-all focus:bg-white/[0.05]"
            error={errors.module?.message}
            {...register('module')}
          />


          {/* Note Field */}
          <FormTextarea
            label="Session Notes"
            icon="notes"
            placeholder="What did you learn today? Any challenges?"
            className="focus:border-primary/50 scrollbar-thin scrollbar-thumb-white/10 min-h-[120px] rounded-3xl border-white/10 bg-white/[0.02] p-4 text-base leading-relaxed font-medium text-white shadow-inner focus:bg-white/[0.05]"
            error={errors.note?.message}
            {...register('note')}
          />
        </Form>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row md:mt-10">
          <PrimaryButton
            type="submit"
            form="attendance-form"
            loading={isPending}
            className="bg-primary hover:bg-primary-hover text-background-dark group/btn flex h-auto flex-[3] items-center justify-center gap-4 rounded-2xl py-4 text-lg font-black shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] transition-all duration-500 hover:shadow-[0_25px_50px_-10px_rgba(var(--primary-rgb),0.5)] active:scale-95 disabled:opacity-50 md:rounded-[2.5rem] md:py-6 md:text-xl"
          >
            <Icon
              name="how_to_reg"
              className="text-3xl transition-transform group-hover/btn:scale-110 group-hover/btn:rotate-6 md:text-4xl"
            />
            MARK ATTENDANCE
          </PrimaryButton>

          <SecondaryButton
            onClick={handleClear}
            className="text-text-secondary group/btn flex h-auto flex-1 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] py-4 text-base font-black tracking-widest uppercase backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/5 active:scale-95 md:rounded-[2.5rem] md:py-6 md:text-lg"
          >
            <Icon
              name="refresh"
              className="text-2xl transition-transform duration-700 group-hover/btn:rotate-180 md:text-3xl"
            />
            CLEAR
          </SecondaryButton>
        </div>
      </CardContent>
    </Card>
  );
};
