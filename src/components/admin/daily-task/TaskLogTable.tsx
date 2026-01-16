
import React from 'react';
import { Icon } from '@/constants';
import { Task } from '@/types';
import { formatDisplayDate } from '@/utils/dateUtils';
import { Pagination } from '@/components/shared/Pagination';

interface TaskLogTableProps {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskLogTable: React.FC<TaskLogTableProps> = ({
  tasks,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex flex-col gap-6 mt-4 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-2xl font-black uppercase tracking-tight">Assignment Log</h3>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-text-secondary text-xs font-black uppercase tracking-widest opacity-40">
            Monitoring Past Tasks
          </span>
        </div>
      </div>
      <div className="rounded-3xl border border-card-border/50 bg-card-dark overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border-dark scrollbar-track-transparent">
          <table className="w-full min-w-[800px]">
            <thead className="text-gray-400 text-sm font-black uppercase tracking-[0.3em] border-b border-card-border/50 bg-surface-dark/90">
              <tr>
                <th className="px-8 py-6 text-left">Mission</th>
                <th className="px-8 py-6 text-left">Module #</th>
                <th className="px-8 py-6 text-left">Guideline</th>
                <th className="px-8 py-6 text-left">Due Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/10">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/[0.01] transition-colors group h-20">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-sm font-black">
                        {task.mission}
                      </div>
                      <span className="text-white font-bold">Mission {task.mission}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className="text-text-secondary font-black uppercase tracking-tighter">Module {task.moduleNumber}</span>
                  </td>
                  <td className="px-8 py-7 max-w-xs">
                    <p className="text-sm text-text-secondary line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                      {task.guideline}
                    </p>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
                      <Icon name="calendar_month" className="text-base" />
                      {formatDisplayDate(task.dueDate)}
                    </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => onEdit(task)} 
                        className="p-2.5 rounded-lg border border-card-border bg-background-dark/30 text-gray-500 hover:text-primary hover:border-primary/30 transition-all active:scale-90" 
                        title="Edit Task"
                      >
                        <Icon name="edit" className="text-xl" />
                      </button>
                      <button 
                        onClick={() => onDelete(task)} 
                        className="p-2.5 rounded-lg border border-card-border bg-background-dark/30 text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-90" 
                        title="Delete Task"
                      >
                        <Icon name="delete" className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          variant="compact"
        />
      </div>
    </div>
  );
};
