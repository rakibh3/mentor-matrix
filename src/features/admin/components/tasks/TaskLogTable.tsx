
import React from 'react';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconAvatar } from '@/components/ui/icon-avatar';
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Task } from '@/types';
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
    <TooltipProvider>
    <div className="flex flex-col gap-6 mt-4 pb-20">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-2xl font-black uppercase tracking-tight">Assignment Log</h3>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-text-secondary text-xs font-black uppercase tracking-widest opacity-40">
            Monitoring Past Tasks
          </span>
        </div>
      </div>
      <Card className="rounded-3xl border-card-border/50 overflow-hidden shadow-2xl">
        <TableContainer>
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Mission</TableHead>
                <TableHead>Module #</TableHead>
                <TableHead>Guideline</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="h-20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <IconAvatar variant="primary" size="xs">
                        <span className="font-black">{task.mission}</span>
                      </IconAvatar>
                      <span className="text-white font-bold">Mission {task.mission}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-text-secondary font-black uppercase tracking-tighter">Module {task.moduleNumber}</span>
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal">
                    <p className="text-sm text-text-secondary line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                      {task.guideline}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
                      <Icon name="calendar_month" className="text-base" />
                      {formatDisplayDate(task.dueDate)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => onEdit(task)} 
                            variant="icon"
                            size="icon"
                            className="rounded-lg border border-card-border bg-background-dark/30 hover:text-primary hover:border-primary/30" 
                          >
                            <Icon name="edit" className="text-xl" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Task</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => onDelete(task)} 
                            variant="icon"
                            size="icon"
                            className="rounded-lg border border-card-border bg-background-dark/30 hover:text-red-500 hover:border-red-500/30" 
                          >
                            <Icon name="delete" className="text-xl" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Task</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          variant="compact"
        />
      </Card>
    </div>
    </TooltipProvider>
  );
};
