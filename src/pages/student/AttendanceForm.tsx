import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, StatusDot, useToast } from '@/components/ui';

import { Icon } from '@/constants';
import { attendanceFormSchema } from '@/lib/validations/attendance.schema';
import type { AttendanceFormData } from './types';
import { Form, FormInput, FormSelect, FormTextarea } from '@/components/shared/Form';
import { PrimaryButton, SecondaryButton } from '@/components/shared/Button';
import { useMarkAttendance } from '@/api/hooks/attendance/useMarkAttendance';

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
      videoNumber: '',
      verificationCode: '',
      selectedModule: 'Module 4: React Patterns',
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
    // Parse module and mission from selectedModule (e.g., "Module 4: React Patterns")
    const moduleMatch = data.selectedModule.match(/Module (\d+)/);
    const moduleNumber = moduleMatch ? parseInt(moduleMatch[1]) : 4;

    // Prepare the request payload based on API spec
    const attendanceData = {
      student: userId,
      status: 'ATTENDED' as const,
      mission: 1, // Default mission, adjust as needed
      module: moduleNumber,
      moduleVideo: parseInt(data.videoNumber),
      note: data.note,
    };

    markAttendance(attendanceData, {
      onSuccess: (response) => {
        addToast({
          type: 'success',
          title: 'Attendance Recorded',
          message: response.message || `Successfully checked in for ${data.selectedModule}, Video #${data.videoNumber}.${data.note ? ` Note: ${data.note}` : ''}`
        });
        reset();
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred while marking attendance. Please try again.';
        addToast({
          type: 'error',
          title: 'Failed to Mark Attendance',
          message: errorMessage
        });
      },
    });
  };

  const handleClear = () => {
    reset();
  };

  return (
    <Card className={`rounded-[2rem] md:rounded-[3rem] border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl overflow-hidden relative group/attendance h-full ${isLoaded ? 'animate-fade-in-up animate-delay-300' : 'opacity-0'} ${className || ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/attendance:opacity-100 transition-opacity duration-700" />
      <CardContent className="p-8 md:p-10 relative flex flex-col h-full z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-8 gap-4 sm:gap-6">
          <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase text-left leading-none">Mark Attendance</h3>
          <div className="flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:border-primary/30 transition-all cursor-default">
            <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Active Sync</span>
            <StatusDot variant="primary" pulse glow />
          </div>
        </div>
        
        <Form id="attendance-form" form={form} onSubmit={onSubmit} className="flex flex-col gap-6 md:gap-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Video Number Field */}
            <FormInput
              label="Video Number"
              icon="play_circle"
              placeholder="e.g. 12"
              className="h-14 rounded-2xl bg-white/[0.02] border-white/10 focus:bg-white/[0.05] focus:border-primary/50 text-white transition-all text-lg font-black tracking-tight shadow-inner"
              error={errors.videoNumber?.message}
              {...register('videoNumber')}
            />
            
            {/* Verification Code Field */}
            <FormInput
              label="Session Code"
              icon="verified_user"
              placeholder="4-digit code"
              className="h-14 rounded-2xl bg-white/[0.02] border-white/10 focus:bg-white/[0.05] focus:border-primary/50 text-white transition-all text-lg font-black tracking-[0.3em] shadow-inner"
              error={errors.verificationCode?.message}
              {...register('verificationCode')}
            />
          </div>

          {/* Active Module Field */}
          <FormSelect
            name="selectedModule"
            control={control}
            label="Current Module"
            icon="layers"
            className="min-h-[3.5rem] h-auto py-2 rounded-2xl bg-white/[0.02] border-white/10 focus:bg-white/[0.05] focus:border-primary/50 text-white transition-all text-sm md:text-base font-black shadow-inner"
            placeholder="Select Module"
            options={[
              { value: "Module 4: React Patterns", label: "Module 4: React Patterns" },
              { value: "Module 5: Backend & API", label: "Module 5: Backend & API" }
            ]}
            error={errors.selectedModule?.message}
          />

          {/* Note Field */}
          <FormTextarea
            label="Session Notes"
            icon="notes"
            placeholder="What did you learn today? Any challenges?"
            className="min-h-[120px] bg-white/[0.02] border-white/10 focus:bg-white/[0.05] focus:border-primary/50 text-white rounded-3xl p-4 text-base font-medium leading-relaxed shadow-inner scrollbar-thin scrollbar-thumb-white/10"
            error={errors.note?.message}
            {...register('note')}
          />
        </Form>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-8 md:mt-10">
          <PrimaryButton 
            type="submit"
            form="attendance-form"
            loading={isPending}
            className="flex-[3] flex items-center justify-center gap-4 rounded-2xl md:rounded-[2.5rem] bg-primary hover:bg-primary-hover text-background-dark text-lg md:text-xl font-black py-4 md:py-6 h-auto shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_25px_50px_-10px_rgba(var(--primary-rgb),0.5)] active:scale-95 transition-all duration-500 group/btn disabled:opacity-50"
          >
            <Icon name="how_to_reg" className="text-3xl md:text-4xl group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-transform" />
            MARK ATTENDANCE
          </PrimaryButton>
          
          <SecondaryButton 
            onClick={handleClear}
            className="flex-1 flex items-center justify-center gap-3 rounded-2xl md:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-md text-text-secondary text-base md:text-lg font-black uppercase tracking-widest py-4 md:py-6 h-auto hover:bg-white/5 hover:border-white/20 active:scale-95 transition-all group/btn"
          >
            <Icon name="refresh" className="text-2xl md:text-3xl group-hover/btn:rotate-180 transition-transform duration-700" />
            CLEAR
          </SecondaryButton>
        </div>
      </CardContent>
    </Card>
  );
};
