import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Icon } from '@/constants';
import { Button } from '@/components/ui/button';
import { TimelineDot } from '@/components/ui/timeline-dot';
import type { AdminStudent } from '@/types';

interface CallHistoryModalProps {
  student: AdminStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CallHistoryModal: React.FC<CallHistoryModalProps> = ({ student, isOpen, onClose }) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl">
        <VisuallyHidden>
          <DialogTitle>Outreach Log: {student.name}</DialogTitle>
          <DialogDescription>View call history and outreach attempts</DialogDescription>
        </VisuallyHidden>
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
                    <TimelineDot 
                      variant={call.outcome === 'Received' ? 'primary' : 'danger'} 
                      className="absolute -left-[3.15rem] top-1 z-10" 
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{call.date}</span>
                      <p className="text-base font-black text-white tracking-tight">{call.outcome}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onClose} className="mt-8 w-full">
            Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
