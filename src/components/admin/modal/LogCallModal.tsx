
import React from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon } from '@/constants';
import { FlaggedStudent, CallOutcome } from '@/types';

interface LogCallModalProps {
  student: FlaggedStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (outcome: CallOutcome) => void;
}

export const LogCallModal: React.FC<LogCallModalProps> = ({ student, isOpen, onClose, onLog }) => {
  if (!student) return null;

  const outcomes: CallOutcome[] = ['Received', 'Not Received', 'Busy', 'Left Voicemail', 'Wrong Number'];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-10 flex flex-col">
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Log Outreach: {student.name}</h3>
        <div className="grid grid-cols-1 gap-3 mt-4">
          {outcomes.map(outcome => (
            <button 
              key={outcome} 
              onClick={() => onLog(outcome)} 
              className="w-full h-14 rounded-xl border border-card-border bg-background-dark/50 text-white text-sm font-black uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-between px-6 group"
            >
              {outcome}
              <Icon name="arrow_forward" className="opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
