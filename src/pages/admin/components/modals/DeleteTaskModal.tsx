import React from 'react';
import type { Task } from '@/types';

import { ConfirmationModal } from './ConfirmationModal';

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
  onConfirm,
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
          Are you sure you want to delete{' '}
          <span className="font-bold text-white">Mission {task.mission}</span>? This action cannot
          be undone.
        </>
      }
      confirmText="Confirm Delete"
      cancelText="Cancel"
      variant="danger"
    />
  );
};
