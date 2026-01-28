
import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import type { Task } from '@/types';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onConfirm: () => void;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  task, 
  onConfirm 
}) => {
  if (!task) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon="delete_forever"
      title="Delete Task"
      description={
        <>
          Are you sure you want to delete <span className="text-white font-bold">Mission {task.mission}</span>? This action cannot be undone.
        </>
      }
      confirmText="Confirm Delete"
      cancelText="Cancel"
      variant="danger"
    />
  );
};
