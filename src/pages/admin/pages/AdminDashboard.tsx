import React, { useState } from 'react';
import { Icon } from '@/constants';

import {
  useCloseWindow,
  useMarkAbsent,
  useOpenWindow,
  useWindowStatus,
} from '@/api/hooks/attendance';
import { StatusDot, useToast } from '@/components/ui';
// Modals
import {
  BulkAbsentModal,
} from '@/pages/admin/components/modals';
import {
  AnalyticsSnapshot,
  SessionMonitor,
  StatCards,
} from '@/pages/admin/components/overview';

const AdminDashboard: React.FC = () => {
  const { addToast } = useToast();
  const [isBulkAbsentModalOpen, setIsBulkAbsentModalOpen] = useState(false);

  // Session Window Status and Mutations
  const { data: windowStatusData } = useWindowStatus();
  const { mutate: openWindow, isPending: isOpening } = useOpenWindow();
  const { mutate: closeWindow, isPending: isClosing } = useCloseWindow();
  const { mutate: markAbsent, isPending: isMarkingAbsent } = useMarkAbsent();

  const isAttendanceOpen = windowStatusData?.data?.isOpen ?? false;

  const handleToggleAttendance = () => {
    if (isAttendanceOpen) {
      closeWindow(undefined, {
        onSuccess: (res) => {
          addToast({
            type: 'success',
            title: 'Session Closed',
            message: res.message || 'Attendance window closed.',
          });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Error',
            message: err.response?.data?.message || 'Failed to close window.',
          });
        },
      });
    } else {
      openWindow(undefined, {
        onSuccess: (res) => {
          addToast({
            type: 'success',
            title: 'Session Opened',
            message: res.message || 'Attendance window opened.',
          });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Error',
            message: err.response?.data?.message || 'Failed to open window.',
          });
        },
      });
    }
  };

  const handleBulkAbsentConfirm = () => {
    markAbsent(
      { date: new Date().toISOString() },
      {
        onSuccess: (response) => {
          setIsBulkAbsentModalOpen(false);
          addToast({
            type: 'success',
            title: 'Action Complete',
            message: response.message || 'All enrolled students marked absent for the day.',
          });
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || error.message || 'Failed to mark students as absent.';
          addToast({
            type: 'error',
            title: 'Action Failed',
            message: errorMessage,
          });
        },
      }
    );
  };


  return (
    <>
      <div className="selection:bg-primary/30 animate-fade-in-up flex w-full flex-col gap-10 pb-20">
        {/* Header Area */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl leading-tight font-black tracking-tight text-white uppercase">
              Admin Overview
            </h2>
            <p className="text-text-secondary flex items-center gap-2 text-base font-medium">
              <StatusDot variant="primary" pulse glow />
              System Live • Fall 2023 Session Monitoring
            </p>
          </div>
          <div className="text-text-secondary bg-surface-dark border-border-dark flex h-[60px] items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-black tracking-widest uppercase shadow-inner">
            <Icon name="calendar_today" className="text-primary text-xl" />
            <span>09:42 AM • Oct 24</span>
          </div>
        </div>

        <StatCards />

        <SessionMonitor
          isAttendanceOpen={isAttendanceOpen}
          onToggleAttendance={handleToggleAttendance}
          onMarkAllAbsent={() => setIsBulkAbsentModalOpen(true)}
          isLoading={isOpening || isClosing}
        />

        <AnalyticsSnapshot />
      </div>

      {/* Extracted Modals */}
      <BulkAbsentModal
        isOpen={isBulkAbsentModalOpen}
        onClose={() => setIsBulkAbsentModalOpen(false)}
        onConfirm={handleBulkAbsentConfirm}
        isLoading={isMarkingAbsent}
      />
    </>
  );
};

export default AdminDashboard;
