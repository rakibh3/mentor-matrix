import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/layout/AdminLayout';
import { Icon } from '@/constants';
import { Task } from '@/types';
import { fetchTasks } from '@/services/api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Sub-components
import { TaskPlanner } from '@/components/admin/daily-task/TaskPlanner';
import { TaskLogTable } from '@/components/admin/daily-task/TaskLogTable';

// Modals
import { DeleteTaskModal } from '@/components/admin/modal/DeleteTaskModal';
import { EditTaskModal } from '@/components/admin/modal/EditTaskModal';

interface AdminTasksProps {
  onLogout: () => void;
}

const AdminTasks: React.FC<AdminTasksProps> = ({ onLogout }) => {
  const queryClient = useQueryClient();
  
  // Data Fetching
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Planner state
  const [upcomingModule, setUpcomingModule] = useState('Module 5');
  const [upcomingMission, setUpcomingMission] = useState('Mission 1');
  const [upcomingGuideline, setUpcomingGuideline] = useState('');

  // Modal selection states
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const totalPages = Math.ceil(tasks.length / rowsPerPage);
  const currentTasks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return tasks.slice(start, start + rowsPerPage);
  }, [currentPage, tasks]);

  const clearNewTaskForm = () => {
    setUpcomingGuideline('');
    setUpcomingModule('Module 5');
    setUpcomingMission('Mission 1');
  };

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Task) => newTask,
    onSuccess: (newTask) => {
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => [newTask, ...(old || [])]);
      clearNewTaskForm();
    }
  });

  const handleBroadcastTask = () => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      mission: parseInt(upcomingMission.split(' ')[1]),
      moduleNumber: parseInt(upcomingModule.split(' ')[1]),
      guideline: upcomingGuideline,
      dueDate: new Date().toISOString().split('T')[0]
    };
    addTaskMutation.mutate(newTask);
  };

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: (id) => {
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => old?.filter(t => t.id !== id));
      setTaskToDelete(null);
    }
  });

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTaskMutation.mutate(taskToDelete.id);
    }
  };

  const editTaskMutation = useMutation({
    mutationFn: async (updated: Task) => updated,
    onSuccess: (updated) => {
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => old?.map(t => t.id === updated.id ? updated : t));
      setTaskToEdit(null);
    }
  });

  const handleEditSave = (updatedTask: Task) => {
    editTaskMutation.mutate(updatedTask);
  };

  if (isLoading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="w-full flex flex-col gap-10 selection:bg-primary/30 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-white text-4xl font-black leading-tight tracking-tight uppercase">Daily Task Management</h2>
            <p className="text-text-secondary text-base font-medium">Schedule and manage curriculum for Full Stack Web Dev (Cohort 12)</p>
          </div>
          <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-text-secondary bg-surface-dark px-5 py-3 rounded-xl border border-border-dark shadow-inner">
            <Icon name="calendar_today" className="text-xl text-primary" />
            <span>October 24, 2023</span>
          </div>
        </div>

        {/* Task Management Section */}
        <div className="flex justify-center">
          <div className="w-full">
            <TaskPlanner 
              module={upcomingModule}
              onModuleChange={setUpcomingModule}
              mission={upcomingMission}
              onMissionChange={setUpcomingMission}
              guideline={upcomingGuideline}
              onGuidelineChange={setUpcomingGuideline}
              onBroadcast={handleBroadcastTask}
              onClear={clearNewTaskForm}
            />
          </div>
        </div>

        {/* Task Log Table */}
        <TaskLogTable 
          tasks={currentTasks}
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

    </AdminLayout>
  );
};

export default AdminTasks;