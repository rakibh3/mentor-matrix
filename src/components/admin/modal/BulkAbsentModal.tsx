
import React from 'react';
import { ConfirmationModal } from '@/components/admin/modal/ConfirmationModal';

interface BulkAbsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const BulkAbsentModal: React.FC<BulkAbsentModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon="warning"
      title="Bulk Absent Action"
      description={
        <>
          Mark <span className="text-white font-bold italic">all students</span> as absent for today's session?
        </>
      }
      confirmText="Confirm"
      cancelText="Cancel"
      variant="danger"
    />
  );
};
