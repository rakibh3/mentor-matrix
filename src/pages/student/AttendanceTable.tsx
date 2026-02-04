import React, { useMemo } from 'react';
import { Icon } from '@/constants';

import { DataTable, type ColumnDef } from '@/components/shared/Table';
import { Badge, IconAvatar, StatusDot } from '@/components/ui';
import { usePagination } from '@/hooks/usePagination';

import type { AttendanceRecord } from './types';

interface AttendanceTableProps {
  attendanceHistory: AttendanceRecord[];
  isLoaded: boolean;
}

/**
 * Attendance history table component with pagination
 */
export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendanceHistory,
  isLoaded,
}) => {
  const { currentPage, totalPages, currentData, handlePageChange } = usePagination(
    attendanceHistory,
    10
  );

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(
    () => [
      {
        key: 'date',
        header: 'Session Date',
        className: 'px-6 py-4 md:px-12 md:py-8',
        accessor: (row) => (
          <span className="group-hover:text-primary text-xs font-black tracking-tight text-gray-100 transition-colors md:text-sm">
            {row.date}
          </span>
        ),
      },
      {
        key: 'module',
        header: 'Module',
        className: 'px-6 py-4 md:px-12 md:py-8',
        accessor: (row) => (
          <span className="text-xs text-gray-400 transition-colors group-hover:text-gray-200 md:text-sm">
            {row.module}
          </span>
        ),
      },
      {
        key: 'topic',
        header: 'Topic Covered',
        className: 'px-6 py-4 md:px-12 md:py-8',
        accessor: (row) => (
          <div className="flex min-w-[120px] flex-col gap-1 md:gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-300 md:gap-3 md:text-sm">
              <Icon
                name="play_circle"
                className="group-hover:text-primary text-sm opacity-40 transition-colors md:text-lg"
              />
              {row.topic}
            </div>
            {row.note && (
              <p className="text-text-secondary/60 line-clamp-1 pl-6 text-[10px] italic transition-all group-hover:line-clamp-none md:pl-8 md:text-xs">
                Note: {row.note}
              </p>
            )}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        className: 'px-6 py-4 md:px-12 md:py-8 text-center',
        accessor: (row) => (
          <div className="flex justify-center">
            <Badge
              variant={row.status === 'Present' ? 'primary' : 'danger'}
              className="gap-1.5 rounded-lg px-3 py-1 text-[10px] md:gap-2 md:rounded-xl md:px-5 md:py-2 md:text-xs"
            >
              <Icon
                name={row.status === 'Present' ? 'check_circle' : 'cancel'}
                className="text-sm md:text-[16px]"
              />
              {row.status}
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  const headerContent = (
    <div className="group/header relative flex flex-col items-start justify-between gap-8 overflow-hidden p-8 sm:flex-row sm:items-center md:p-12">
      <div className="from-primary/10 absolute inset-0 bg-gradient-to-r via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover/header:opacity-100" />
      <div className="relative z-10 flex items-center gap-6">
        <IconAvatar
          variant="primary"
          size="md"
          bordered={false}
          className="size-12 border border-white/10 bg-white/5 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover/header:scale-110 group-hover/header:rotate-6 md:size-20"
        >
          <Icon name="history" className="text-primary text-2xl md:text-4xl" />
        </IconAvatar>
        <div>
          <h3 className="mb-2 text-2xl leading-none font-black tracking-tighter text-white uppercase md:text-3xl">
            Attendance Log
          </h3>
          <p className="text-text-secondary group-hover/header:text-primary text-[10px] font-black tracking-[0.2em] uppercase opacity-50 transition-all group-hover/header:opacity-100 md:text-xs">
            Full history of sessions
          </p>
        </div>
      </div>
      <div className="relative z-10 flex w-full flex-row items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
        <div className="hover:border-primary/30 flex cursor-default items-center gap-3 rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 transition-colors">
          <span className="text-text-secondary text-[10px] font-black tracking-widest whitespace-nowrap uppercase md:text-xs">
            Active Sync
          </span>
          <StatusDot variant="primary" pulse glow size="sm" />
        </div>
        <span className="text-[10px] font-black tracking-tighter text-gray-500 uppercase opacity-60 md:text-xs">
          <span className="text-primary">{currentData.length}</span> of {attendanceHistory.length}{' '}
          records
        </span>
      </div>
    </div>
  );

  return (
    <div className={`mb-24 ${isLoaded ? 'animate-fade-in-up animate-delay-500' : 'opacity-0'}`}>
      <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl md:rounded-[3rem]">
        <DataTable
          data={currentData}
          columns={columns}
          headerContent={headerContent}
          pagination={{
            currentPage,
            totalPages,
            pageSize: 10,
            onPageChange: handlePageChange,
          }}
          emptyMessage="No attendance records found."
        />
      </div>
    </div>
  );
};
