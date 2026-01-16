
import React from 'react';
import { Modal } from '@/components/shared/Modal';
import { Icon } from '@/constants';
import { FlaggedStudent } from '@/types';

interface CallHistoryModalProps {
  student: FlaggedStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CallHistoryModal: React.FC<CallHistoryModalProps> = ({ student, isOpen, onClose }) => {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-10 flex flex-col h-[600px]">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Outreach Log: {student.name}</h3>
        <div className="flex-1 overflow-y-auto pr-2">
          {student.callHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
              <Icon name="call_end" className="text-6xl" />
              <p className="text-sm font-black uppercase tracking-widest">No history recorded</p>
            </div>
          ) : (
            <div className="relative flex flex-col gap-10 pl-10 border-l border-card-border/50 ml-4">
              {student.callHistory.map((call, idx) => (
                <div key={idx} className="relative group">
                  <div className={`absolute -left-[3.15rem] top-1 size-5 rounded-full border-4 border-surface-dark z-10 ${call.outcome === 'Received' ? 'bg-primary' : 'bg-red-500'}`}></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{call.date}</span>
                    <p className="text-base font-black text-white tracking-tight">{call.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={onClose} className="mt-8 w-full h-14 rounded-2xl border border-card-border text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all">
          Back
        </button>
      </div>
    </Modal>
  );
};
