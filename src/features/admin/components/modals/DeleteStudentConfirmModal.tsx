
import React from 'react';
import { ConfirmationModal } from '@/features/admin/components/modals/ConfirmationModal';

interface DeleteStudentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  student: any;
  onConfirm: () => void;
}

export const DeleteStudentConfirmModal: React.FC<DeleteStudentConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  student, 
  onConfirm 
}) => {
  if (!student) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon="person_remove"
      title="Delete Student"
      description={
        <>
          Are you sure you want to remove <span className="text-white font-bold">{student.name}</span> from the system? This action is permanent and all progress data will be lost.
        </>
      }
      confirmText="Confirm Removal"
      cancelText="Keep Student"
      variant="danger"
    />
  );
};
