import React, { useMemo } from 'react';
import { Badge, IconAvatar, StatusDot } from '@/components/ui';


import { Icon } from '@/constants';
import { DataTable, type ColumnDef } from '@/components/shared/Table';
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
  isLoaded 
}) => {
  const { currentPage, totalPages, currentData, handlePageChange } = usePagination(
    attendanceHistory,
    10
  );

  const columns = useMemo<ColumnDef<AttendanceRecord>[]>(() => [
    {
      key: 'date',
      header: 'Session Date',
      className: 'px-6 py-4 md:px-12 md:py-8',
      accessor: (row) => (
        <span className="text-gray-100 font-black tracking-tight group-hover:text-primary transition-colors text-xs md:text-sm">
          {row.date}
        </span>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      className: 'px-6 py-4 md:px-12 md:py-8',
      accessor: (row) => (
        <span className="text-gray-400 group-hover:text-gray-200 transition-colors text-xs md:text-sm">
          {row.module}
        </span>
      ),
    },
    {
      key: 'topic',
      header: 'Topic Covered',
      className: 'px-6 py-4 md:px-12 md:py-8',
      accessor: (row) => (
        <div className="flex flex-col gap-1 md:gap-2 min-w-[120px]">
          <div className="flex items-center gap-2 md:gap-3 text-gray-500 group-hover:text-gray-300 text-xs md:text-sm">
            <Icon name="play_circle" className="text-sm md:text-lg opacity-40 group-hover:text-primary transition-colors" />
            {row.topic}
          </div>
          {row.note && (
            <p className="text-[10px] md:text-xs text-text-secondary/60 italic pl-6 md:pl-8 line-clamp-1 group-hover:line-clamp-none transition-all">
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
            className="rounded-lg md:rounded-xl px-3 py-1 md:px-5 md:py-2 gap-1.5 md:gap-2 text-[10px] md:text-xs"
          >
            <Icon name={row.status === 'Present' ? 'check_circle' : 'cancel'} className="text-sm md:text-[16px]" /> 
            {row.status}
          </Badge>
        </div>
      ),
    },
  ], []);

  const headerContent = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 md:p-12 gap-8 relative overflow-hidden group/header">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-700" />
      <div className="flex items-center gap-6 relative z-10">
        <IconAvatar variant="primary" size="md" bordered={false} className="size-12 md:size-20 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] bg-white/5 border border-white/10 group-hover/header:scale-110 group-hover/header:rotate-6 transition-all duration-700">
          <Icon name="history" className="text-2xl md:text-4xl text-primary" />
        </IconAvatar>
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">Attendance Log</h3>
          <p className="text-text-secondary text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-50 group-hover/header:opacity-100 group-hover/header:text-primary transition-all">Full history of sessions</p>
        </div>
      </div>
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 relative z-10">
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-4 py-2 rounded-full hover:border-primary/30 transition-colors cursor-default">
          <span className="text-text-secondary text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">Active Sync</span>
          <StatusDot variant="primary" pulse glow size="sm" />
        </div>
        <span className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-tighter opacity-60">
          <span className="text-primary">{currentData.length}</span> of {attendanceHistory.length} records
        </span>
      </div>
    </div>
  );

  return (
    <div className={`mb-24 ${isLoaded ? 'animate-fade-in-up animate-delay-500' : 'opacity-0'}`}>
      <div className="rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
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
