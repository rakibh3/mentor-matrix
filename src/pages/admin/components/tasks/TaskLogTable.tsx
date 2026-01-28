
import React, { useMemo } from 'react';
import { Icon } from '@/constants';
import { IconAvatar } from '@/components/ui';

import type { Task } from '@/types';
import { formatDisplayDate } from '@/utils/dateUtils';
import { DataTable } from '@/components/shared/Table';
import type { ColumnDef } from '@/components/shared/Table/types';
import { IconButton } from '@/components/shared/Button';

interface TaskLogTableProps {
  tasks: Task[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskLogTable: React.FC<TaskLogTableProps> = ({
  tasks,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete
}) => {
  const columns = useMemo<ColumnDef<Task>[]>(() => [
    {
      key: 'mission',
      header: 'Mission',
      accessor: (task) => (
        <div className="flex items-center gap-3">
          <IconAvatar variant="primary" size="xs">
            <span className="font-black">{task.mission}</span>
          </IconAvatar>
          <span className="text-white font-bold">Mission {task.mission}</span>
        </div>
      ),
    },
    {
      key: 'module',
      header: 'Module #',
      accessor: (task) => (
        <span className="text-text-secondary font-black uppercase tracking-tighter">
          Module {task.moduleNumber}
        </span>
      ),
    },
    {
      key: 'guideline',
      header: 'Guideline',
      accessor: (task) => (
        <div className="max-w-xs whitespace-normal">
          <p className="text-sm text-text-secondary line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
            {task.guideline}
          </p>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      accessor: (task) => (
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
          <Icon name="calendar_month" className="text-base" />
          {formatDisplayDate(task.dueDate)}
        </div>
      ),
    },
  ], []);

  const renderActions = (task: Task) => (
    <div className="flex justify-end items-center gap-3">
      <IconButton
        icon="edit"
        tooltip="Edit Task"
        onClick={() => onEdit(task)}
        className="rounded-lg border border-card-border bg-background-dark/30 hover:text-primary hover:border-primary/30"
      />
      <IconButton
        icon="delete"
        tooltip="Delete Task"
        onClick={() => onDelete(task)}
        className="rounded-lg border border-card-border bg-background-dark/30 hover:text-red-500 hover:border-red-500/30"
      />
    </div>
  );

  const headerContent = (
    <div className="flex items-center justify-between p-6">
      <h3 className="text-white text-2xl font-black uppercase tracking-tight">Assignment Log</h3>
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-text-secondary text-xs font-black uppercase tracking-widest opacity-40">
          Tracking {totalCount} Broadcasted Tasks
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 mt-4 pb-20">
      <DataTable
        data={tasks}
        columns={columns}
        pagination={{
          currentPage,
          totalPages,
          pageSize: 10,
          onPageChange
        }}
        actions={renderActions}
        headerContent={headerContent}
      />
    </div>
  );
};
