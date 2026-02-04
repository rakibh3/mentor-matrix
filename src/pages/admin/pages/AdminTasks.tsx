import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/constants';
import type { Task } from '@/types';

import {
  useCreateTask,
  useCurrentTask,
  useDeleteTask,
  useDueTasks,
  useUpdateTask,
} from '@/api/hooks/tasks';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
// Modals
import { DeleteTaskModal, EditTaskModal } from '@/pages/admin/components/modals';
import { TaskLogTable } from '@/pages/admin/components/tasks/TaskLogTable';
// Sub-components
import { TaskPlanner } from '@/pages/admin/components/tasks/TaskPlanner';

const AdminTasks: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAuth();

  // Data Fetching
  const { data: currentTasksResponse, isLoading: isLoadingCurrent } = useCurrentTask();
  const { data: dueTasksResponse, isLoading: isLoadingDue } = useDueTasks();

  const tasks = useMemo(() => {
    const currentData = currentTasksResponse?.data;
    const dueData = dueTasksResponse?.data;

    // Normalize data into a single array
    const normalize = (d: any) => {
      if (Array.isArray(d)) return d;
      if (d && typeof d === 'object') return [d];
      return [];
    };

    const allTasks = [...normalize(currentData), ...normalize(dueData)];

    // Deduplicate by ID (prioritizing _id as the database truth)
    const uniqueTasksMap = new Map();
    allTasks.forEach((t) => {
      const stableId = t._id || t.id;

      if (stableId) {
        if (!uniqueTasksMap.has(stableId)) {
          uniqueTasksMap.set(stableId, {
            ...t,
            id: stableId, // Ensure 'id' matches the database identifier for backend calls
            _id: stableId,
          });
        }
      } else {
        // Fallback for unexpected missing IDs to avoid 'temp-index' instability
        const tempId = `meta-${t.moduleNumber}-${t.mission}-${t.guideline?.slice(0, 10)}`;
        if (!uniqueTasksMap.has(tempId)) {
          uniqueTasksMap.set(tempId, { ...t, id: tempId });
        }
      }
    });

    // Convert back to array and apply a STABLE sort
    return Array.from(uniqueTasksMap.values()).sort((a: any, b: any) => {
      const dateA = new Date(a.dueDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.dueDate || b.createdAt || 0).getTime();

      if (dateA !== dateB) {
        return dateB - dateA; // Newest first
      }

      // Secondary sort criteria ensures the list order is stable across re-renders
      const idA = String(a.id || '');
      const idB = String(b.id || '');
      return idB.localeCompare(idA);
    });
  }, [currentTasksResponse, dueTasksResponse]);

  const isLoading = isLoadingCurrent || isLoadingDue;

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modal selection states
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const totalPages = Math.ceil(tasks.length / rowsPerPage);
  const currentTasks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return tasks.slice(start, start + rowsPerPage);
  }, [currentPage, tasks]);

  // Guard for pagination: ensure currentPage doesn't exceed totalPages after deletions
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();

  const handleBroadcastTask = (data: { module: string; mission: string; guideline: string }) => {
    if (!user) return;

    createTask(
      {
        mission: parseInt(data.mission.split(' ')[1]),
        moduleNumber: parseInt(data.module.split(' ')[1]),
        guideline: data.guideline,
        dueDate: new Date().toISOString(),
        createdBy: user.name || user.email,
      },
      {
        onSuccess: (res) => {
          setCurrentPage(1);
          addToast({
            type: 'success',
            title: 'Task Broadcasted',
            message: res.message || 'The curriculum task has been successfully sent to students.',
          });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Broadcast Failed',
            message: err.response?.data?.message || 'Failed to broadcast task.',
          });
        },
      }
    );
  };

  const { mutate: deleteTask } = useDeleteTask();

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id, {
        onSuccess: (res) => {
          setTaskToDelete(null);
          addToast({
            type: 'success',
            title: 'Task Deleted',
            message: res.message || 'Curriculum task has been removed.',
          });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Delete Failed',
            message: err.response?.data?.message || 'Failed to delete task.',
          });
        },
      });
    }
  };

  const { mutate: updateTask } = useUpdateTask();

  const handleEditSave = (updatedTask: Task) => {
    updateTask(
      {
        taskId: updatedTask.id,
        data: {
          mission: updatedTask.mission,
          moduleNumber: updatedTask.moduleNumber,
          guideline: updatedTask.guideline,
          dueDate: updatedTask.dueDate,
        },
      },
      {
        onSuccess: (res) => {
          setTaskToEdit(null);
          addToast({
            type: 'success',
            title: 'Task Updated',
            message: res.message || 'The task details have been updated successfully.',
          });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Update Failed',
            message: err.response?.data?.message || 'Failed to update task.',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="selection:bg-primary/30 animate-fade-in-up flex w-full flex-col gap-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl leading-tight font-black tracking-tight text-white uppercase">
              Daily Task Management
            </h2>
            <p className="text-text-secondary text-base font-medium">
              Schedule and manage curriculum for Full Stack Web Dev (Cohort 12)
            </p>
          </div>
          <div className="text-text-secondary bg-surface-dark border-border-dark flex items-center gap-3 rounded-xl border px-5 py-3 text-sm font-black tracking-widest uppercase shadow-inner">
            <Icon name="calendar_today" className="text-primary text-xl" />
            <span>
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Task Management Section */}
        <div className="flex justify-center">
          <div className="w-full">
            <TaskPlanner onBroadcast={handleBroadcastTask} isSubmitting={isCreatingTask} />
          </div>
        </div>

        {/* Task Log Table */}
        <TaskLogTable
          tasks={currentTasks}
          totalCount={tasks.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={setTaskToEdit}
          onDelete={setTaskToDelete}
        />
      </div>

      {/* Modals */}
      <DeleteTaskModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
      />

      <EditTaskModal
        isOpen={!!taskToEdit}
        onClose={() => setTaskToEdit(null)}
        task={taskToEdit}
        onSave={handleEditSave}
      />
    </>
  );
};

export default AdminTasks;
